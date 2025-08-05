export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          id: string
          is_correct: boolean
          player_id: string
          question_id: number
          score_awarded: number
          selected_option_index: number
          submitted_at: string
        }
        Insert: {
          id?: string
          is_correct: boolean
          player_id: string
          question_id: number
          score_awarded?: number
          selected_option_index: number
          submitted_at?: string
        }
        Update: {
          id?: string
          is_correct?: boolean
          player_id?: string
          question_id?: number
          score_awarded?: number
          selected_option_index?: number
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      casesgg_boxes: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      game_state: {
        Row: {
          current_question_id: number | null
          id: number
          round_ends_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          current_question_id?: number | null
          id: number
          round_ends_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          current_question_id?: number | null
          id?: number
          round_ends_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hypedrop_boxes: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      luxdrop_boxes: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          id: string
          is_host: boolean
          last_active_at: string
          score: number
          session_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_host?: boolean
          last_active_at?: string
          score?: number
          session_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_host?: boolean
          last_active_at?: string
          score?: number
          session_id?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          case_description: string
          case_title: string
          created_at: string
          deception_level: number
          explanation: string
          id: number
          image_url: string | null
          options: Json
        }
        Insert: {
          case_description: string
          case_title: string
          created_at?: string
          deception_level: number
          explanation: string
          id?: never
          image_url?: string | null
          options: Json
        }
        Update: {
          case_description?: string
          case_title?: string
          created_at?: string
          deception_level?: number
          explanation?: string
          id?: never
          image_url?: string | null
          options?: Json
        }
        Relationships: []
      }
      rillabox_boxes: {
        Row: {
          all_items: Json | null
          box_image: string | null
          box_name: string
          box_price: number | null
          box_url: string | null
          category: string | null
          data_source: string | null
          ev_to_price_ratio: number | null
          expected_value_percent: number | null
          floor_rate_percent: number | null
          id: number
          jackpot_items: Json | null
          last_updated: string | null
          standard_deviation_percent: number | null
          tags: Json | null
          unwanted_items: Json | null
          volatility_bucket: string | null
        }
        Insert: {
          all_items?: Json | null
          box_image?: string | null
          box_name: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Update: {
          all_items?: Json | null
          box_image?: string | null
          box_name?: string
          box_price?: number | null
          box_url?: string | null
          category?: string | null
          data_source?: string | null
          ev_to_price_ratio?: number | null
          expected_value_percent?: number | null
          floor_rate_percent?: number | null
          id?: number
          jackpot_items?: Json | null
          last_updated?: string | null
          standard_deviation_percent?: number | null
          tags?: Json | null
          unwanted_items?: Json | null
          volatility_bucket?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_game_state_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_leaderboard_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_players_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_player_score: {
        Args: { player_session_id: string; score_to_add: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
