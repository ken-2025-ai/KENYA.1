export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          listing_id: string | null
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          listing_id?: string | null
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "market_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      machinery_bookings: {
        Row: {
          created_at: string
          end_date: string
          farmer_id: string
          farmer_notes: string | null
          id: string
          machinery_id: string
          owner_id: string
          owner_notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          farmer_id: string
          farmer_notes?: string | null
          id?: string
          machinery_id: string
          owner_id: string
          owner_notes?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          farmer_id?: string
          farmer_notes?: string | null
          id?: string
          machinery_id?: string
          owner_id?: string
          owner_notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "machinery_bookings_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "machinery_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      machinery_listings: {
        Row: {
          brand: string | null
          capacity: string | null
          category: Database["public"]["Enums"]["machinery_category"]
          county: string
          created_at: string
          description: string | null
          horsepower: number | null
          id: string
          image_urls: string[] | null
          is_available: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          model: string | null
          owner_id: string
          rating_average: number | null
          rental_period: Database["public"]["Enums"]["rental_period"]
          rental_rate: number
          review_count: number | null
          title: string
          town: string | null
          updated_at: string
          year_manufactured: number | null
        }
        Insert: {
          brand?: string | null
          capacity?: string | null
          category?: Database["public"]["Enums"]["machinery_category"]
          county: string
          created_at?: string
          description?: string | null
          horsepower?: number | null
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          model?: string | null
          owner_id: string
          rating_average?: number | null
          rental_period?: Database["public"]["Enums"]["rental_period"]
          rental_rate: number
          review_count?: number | null
          title: string
          town?: string | null
          updated_at?: string
          year_manufactured?: number | null
        }
        Update: {
          brand?: string | null
          capacity?: string | null
          category?: Database["public"]["Enums"]["machinery_category"]
          county?: string
          created_at?: string
          description?: string | null
          horsepower?: number | null
          id?: string
          image_urls?: string[] | null
          is_available?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          model?: string | null
          owner_id?: string
          rating_average?: number | null
          rental_period?: Database["public"]["Enums"]["rental_period"]
          rental_rate?: number
          review_count?: number | null
          title?: string
          town?: string | null
          updated_at?: string
          year_manufactured?: number | null
        }
        Relationships: []
      }
      machinery_reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          machinery_id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          machinery_id: string
          rating: number
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          machinery_id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "machinery_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "machinery_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "machinery_reviews_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "machinery_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      market_listings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          expiry_date: string | null
          harvest_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          price_per_unit: number
          quantity_available: number
          sold_at: string | null
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          price_per_unit: number
          quantity_available?: number
          sold_at?: string | null
          title: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          price_per_unit?: number
          quantity_available?: number
          sold_at?: string | null
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
          type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
          type?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          farm_size: string | null
          farming_type: string | null
          full_name: string | null
          id: string
          is_equipment_owner: boolean | null
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          farm_size?: string | null
          farming_type?: string | null
          full_name?: string | null
          id?: string
          is_equipment_owner?: boolean | null
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          farm_size?: string | null
          farming_type?: string | null
          full_name?: string | null
          id?: string
          is_equipment_owner?: boolean | null
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          name: string
          phone: string | null
          status: string
          ticket_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          ticket_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          ticket_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_sold_listings: { Args: never; Returns: undefined }
    }
    Enums: {
      booking_status:
        | "pending"
        | "approved"
        | "rejected"
        | "in_progress"
        | "completed"
        | "cancelled"
      machinery_category:
        | "tractor"
        | "harvester"
        | "plough"
        | "sprayer"
        | "pump"
        | "seeder"
        | "thresher"
        | "trailer"
        | "other"
      rental_period: "hourly" | "daily" | "weekly" | "per_acre"
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
    Enums: {
      booking_status: [
        "pending",
        "approved",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      machinery_category: [
        "tractor",
        "harvester",
        "plough",
        "sprayer",
        "pump",
        "seeder",
        "thresher",
        "trailer",
        "other",
      ],
      rental_period: ["hourly", "daily", "weekly", "per_acre"],
    },
  },
} as const
