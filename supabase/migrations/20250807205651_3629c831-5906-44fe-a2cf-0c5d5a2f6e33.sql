-- Ensure IP/user-agent capture and 3-vote limit per IP, plus helper RPC to show remaining votes

-- 1) Function: set_vote_ip_and_ua (updates IP & UA, enforces max 3 votes/IP)
CREATE OR REPLACE FUNCTION public.set_vote_ip_and_ua()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  xfwd text;
  xreal text;
  ua text;
  first_ip text;
  existing_count integer := 0;
BEGIN
  -- Populate IP from headers if not provided
  IF NEW.ip_address IS NULL THEN
    BEGIN
      xfwd := current_setting('request.headers.x-forwarded-for', true);
    EXCEPTION WHEN others THEN
      xfwd := NULL;
    END;

    IF xfwd IS NOT NULL AND length(trim(xfwd)) > 0 THEN
      first_ip := split_part(xfwd, ',', 1);
    ELSE
      BEGIN
        xreal := current_setting('request.headers.x-real-ip', true);
      EXCEPTION WHEN others THEN
        xreal := NULL;
      END;
      first_ip := xreal;
    END IF;

    IF first_ip IS NOT NULL AND length(trim(first_ip)) > 0 THEN
      BEGIN
        NEW.ip_address := first_ip::inet;
      EXCEPTION WHEN others THEN
        -- If casting fails, leave as NULL
        NEW.ip_address := NULL;
      END;
    END IF;
  END IF;

  -- Populate user agent from header if missing
  IF NEW.user_agent IS NULL OR length(trim(NEW.user_agent)) = 0 THEN
    BEGIN
      ua := current_setting('request.headers.user-agent', true);
      IF ua IS NOT NULL THEN
        NEW.user_agent := ua;
      END IF;
    EXCEPTION WHEN others THEN
      -- ignore
    END;
  END IF;

  -- Enforce a maximum of 3 votes per IP address (across all projects)
  IF NEW.ip_address IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_count FROM public.community_votes WHERE ip_address = NEW.ip_address;
    IF existing_count >= 3 THEN
      RAISE EXCEPTION 'This IP has used all available votes (3).'
        USING ERRCODE = 'P0001', HINT = 'Vote limit reached for this IP.';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2) Trigger: attach function to community_votes inserts
DROP TRIGGER IF EXISTS community_votes_set_ip_ua ON public.community_votes;
CREATE TRIGGER community_votes_set_ip_ua
BEFORE INSERT ON public.community_votes
FOR EACH ROW
EXECUTE FUNCTION public.set_vote_ip_and_ua();

-- 3) RPC: get_ip_vote_stats (to show remaining votes and which projects were voted from this IP)
CREATE OR REPLACE FUNCTION public.get_ip_vote_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  xfwd text;
  xreal text;
  ip_text text;
  ip_addr inet;
  vote_count int := 0;
  projects uuid[];
BEGIN
  BEGIN
    xfwd := current_setting('request.headers.x-forwarded-for', true);
  EXCEPTION WHEN others THEN
    xfwd := NULL;
  END;

  IF xfwd IS NOT NULL AND length(trim(xfwd)) > 0 THEN
    ip_text := split_part(xfwd, ',', 1);
  ELSE
    BEGIN
      xreal := current_setting('request.headers.x-real-ip', true);
    EXCEPTION WHEN others THEN
      xreal := NULL;
    END;
    ip_text := xreal;
  END IF;

  IF ip_text IS NOT NULL AND length(trim(ip_text)) > 0 THEN
    BEGIN
      ip_addr := ip_text::inet;
    EXCEPTION WHEN others THEN
      ip_addr := NULL;
    END;
  END IF;

  IF ip_addr IS NULL THEN
    RETURN jsonb_build_object(
      'ip', NULL,
      'total_votes', 0,
      'remaining', 3,
      'projects', '[]'::jsonb
    );
  END IF;

  SELECT count(*), coalesce(array_agg(project_id), '{}')
  INTO vote_count, projects
  FROM public.community_votes
  WHERE ip_address = ip_addr;

  RETURN jsonb_build_object(
    'ip', ip_addr::text,
    'total_votes', vote_count,
    'remaining', GREATEST(3 - vote_count, 0),
    'projects', to_jsonb(projects)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_ip_vote_stats() TO anon, authenticated;