export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          gender: "male" | "female" | "non-binary" | "prefer-not-to-say" | null;
          avatar_url: string | null;
          location: Json;
          preferences: Json;
          subscription: "free" | "pro" | "elite";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          gender?: "male" | "female" | "non-binary" | "prefer-not-to-say" | null;
          avatar_url?: string | null;
          location?: Json;
          preferences?: Json;
          subscription?: "free" | "pro" | "elite";
          stripe_customer_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      analyses: {
        Row: {
          id: string;
          user_id: string | null;
          image_url: string;
          category: "full" | "hair" | "skin" | "nails";
          ai_provider: "gemini" | "openai" | null;
          raw_result: Json;
          style_score: number | null;
          hair_analysis: Json;
          skin_analysis: Json;
          nail_analysis: Json;
          grooming_analysis: Json;
          preferences: Json;
          status: "processing" | "completed" | "failed";
          processing_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          image_url: string;
          category: "full" | "hair" | "skin" | "nails";
          ai_provider?: "gemini" | "openai" | null;
          raw_result?: Json;
          style_score?: number | null;
          hair_analysis?: Json;
          skin_analysis?: Json;
          nail_analysis?: Json;
          grooming_analysis?: Json;
          preferences?: Json;
          status?: "processing" | "completed" | "failed";
          processing_ms?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      recommendations: {
        Row: {
          id: string;
          analysis_id: string;
          category: "hair" | "skin" | "nails" | "grooming" | "spa";
          title: string;
          description: string;
          priority: "quick_win" | "major_impact" | "maintenance";
          expected_outcome: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          category: "hair" | "skin" | "nails" | "grooming" | "spa";
          title: string;
          description: string;
          priority: "quick_win" | "major_impact" | "maintenance";
          expected_outcome?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["recommendations"]["Insert"]>;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Analysis = Database["public"]["Tables"]["analyses"]["Row"];
export type Recommendation = Database["public"]["Tables"]["recommendations"]["Row"];
