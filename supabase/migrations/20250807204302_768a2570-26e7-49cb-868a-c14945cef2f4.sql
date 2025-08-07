-- Ensure unique vote per IP per project (allow multiple when IP unknown)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_community_votes_project_ip
ON public.community_votes (project_id, ip_address)
WHERE ip_address IS NOT NULL;

-- Ensure IP and User-Agent are populated from request headers on insert
DROP TRIGGER IF EXISTS trg_set_vote_ip_and_ua ON public.community_votes;
CREATE TRIGGER trg_set_vote_ip_and_ua
BEFORE INSERT ON public.community_votes
FOR EACH ROW
EXECUTE FUNCTION public.set_vote_ip_and_ua();