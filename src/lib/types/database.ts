Initialising login role...
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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      peak_conditions: {
        Row: {
          cloud_cover_percent: number | null
          feels_like_f: number | null
          fetched_at: string | null
          forecast_date: string
          high_f: number | null
          humidity_percent: number | null
          id: string
          low_f: number | null
          peak_id: string
          precipitation_in: number | null
          snow_in: number | null
          temperature_f: number | null
          uv_index: number | null
          weather_code: number | null
          wind_direction: number | null
          wind_gust_mph: number | null
          wind_speed_mph: number | null
        }
        Insert: {
          cloud_cover_percent?: number | null
          feels_like_f?: number | null
          fetched_at?: string | null
          forecast_date: string
          high_f?: number | null
          humidity_percent?: number | null
          id?: string
          low_f?: number | null
          peak_id: string
          precipitation_in?: number | null
          snow_in?: number | null
          temperature_f?: number | null
          uv_index?: number | null
          weather_code?: number | null
          wind_direction?: number | null
          wind_gust_mph?: number | null
          wind_speed_mph?: number | null
        }
        Update: {
          cloud_cover_percent?: number | null
          feels_like_f?: number | null
          fetched_at?: string | null
          forecast_date?: string
          high_f?: number | null
          humidity_percent?: number | null
          id?: string
          low_f?: number | null
          peak_id?: string
          precipitation_in?: number | null
          snow_in?: number | null
          temperature_f?: number | null
          uv_index?: number | null
          weather_code?: number | null
          wind_direction?: number | null
          wind_gust_mph?: number | null
          wind_speed_mph?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "peak_conditions_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
        ]
      }
      peak_images: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_hero: boolean | null
          peak_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_hero?: boolean | null
          peak_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_hero?: boolean | null
          peak_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "peak_images_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
        ]
      }
      peaks: {
        Row: {
          created_at: string | null
          description: string | null
          elevation: number
          hero_image_url: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          national_forest: string | null
          nearest_town: string | null
          prominence_ft: number | null
          range: string
          rank: number | null
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          elevation: number
          hero_image_url?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          national_forest?: string | null
          nearest_town?: string | null
          prominence_ft?: number | null
          range: string
          rank?: number | null
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          elevation?: number
          hero_image_url?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          national_forest?: string | null
          nearest_town?: string | null
          prominence_ft?: number | null
          range?: string
          rank?: number | null
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_public: boolean | null
          location: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          is_public?: boolean | null
          location?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          cell_service: string | null
          created_at: string | null
          description: string | null
          difficulty_class: number
          distance_miles: number
          elevation_gain_ft: number
          exposure: string | null
          four_wd_required: boolean | null
          gear_notes: string | null
          gpx_file_url: string | null
          id: string
          is_standard: boolean | null
          name: string
          overflow_options: string | null
          parking_capacity: string | null
          parking_fee_amount: number | null
          parking_fee_notes: string | null
          parking_fee_type: string | null
          parking_notes: string | null
          parking_type: string | null
          peak_id: string
          recommended_arrival_time: string | null
          restroom_available: boolean | null
          route_notes: string | null
          route_type: string | null
          shuttle_available: boolean | null
          shuttle_info: string | null
          slug: string
          trail_geometry: Json | null
          trailhead_elevation: number | null
          trailhead_latitude: number | null
          trailhead_longitude: number | null
          trailhead_name: string | null
          typical_time_hours: string | null
          updated_at: string | null
        }
        Insert: {
          cell_service?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_class: number
          distance_miles: number
          elevation_gain_ft: number
          exposure?: string | null
          four_wd_required?: boolean | null
          gear_notes?: string | null
          gpx_file_url?: string | null
          id?: string
          is_standard?: boolean | null
          name: string
          overflow_options?: string | null
          parking_capacity?: string | null
          parking_fee_amount?: number | null
          parking_fee_notes?: string | null
          parking_fee_type?: string | null
          parking_notes?: string | null
          parking_type?: string | null
          peak_id: string
          recommended_arrival_time?: string | null
          restroom_available?: boolean | null
          route_notes?: string | null
          route_type?: string | null
          shuttle_available?: boolean | null
          shuttle_info?: string | null
          slug: string
          trail_geometry?: Json | null
          trailhead_elevation?: number | null
          trailhead_latitude?: number | null
          trailhead_longitude?: number | null
          trailhead_name?: string | null
          typical_time_hours?: string | null
          updated_at?: string | null
        }
        Update: {
          cell_service?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_class?: number
          distance_miles?: number
          elevation_gain_ft?: number
          exposure?: string | null
          four_wd_required?: boolean | null
          gear_notes?: string | null
          gpx_file_url?: string | null
          id?: string
          is_standard?: boolean | null
          name?: string
          overflow_options?: string | null
          parking_capacity?: string | null
          parking_fee_amount?: number | null
          parking_fee_notes?: string | null
          parking_fee_type?: string | null
          parking_notes?: string | null
          parking_type?: string | null
          peak_id?: string
          recommended_arrival_time?: string | null
          restroom_available?: boolean | null
          route_notes?: string | null
          route_type?: string | null
          shuttle_available?: boolean | null
          shuttle_info?: string | null
          slug?: string
          trail_geometry?: Json | null
          trailhead_elevation?: number | null
          trailhead_latitude?: number | null
          trailhead_longitude?: number | null
          trailhead_name?: string | null
          typical_time_hours?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_reports: {
        Row: {
          arrival_time: string | null
          created_at: string | null
          crowd_level: string | null
          hazards: string[] | null
          hike_date: string
          id: string
          notes: string | null
          parking_notes: string | null
          parking_status: string | null
          peak_id: string
          road_status: string | null
          snow_depth_inches: number | null
          trail_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string | null
          crowd_level?: string | null
          hazards?: string[] | null
          hike_date: string
          id?: string
          notes?: string | null
          parking_notes?: string | null
          parking_status?: string | null
          peak_id: string
          road_status?: string | null
          snow_depth_inches?: number | null
          trail_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          arrival_time?: string | null
          created_at?: string | null
          crowd_level?: string | null
          hazards?: string[] | null
          hike_date?: string
          id?: string
          notes?: string | null
          parking_notes?: string | null
          parking_status?: string | null
          peak_id?: string
          road_status?: string | null
          snow_depth_inches?: number | null
          trail_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_reports_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_reports_profile_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          notified: boolean | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          notified?: boolean | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          notified?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reviews: {
        Row: {
          body: string | null
          conditions: string | null
          created_at: string | null
          date_climbed: string | null
          id: string
          peak_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          conditions?: string | null
          created_at?: string | null
          date_climbed?: string | null
          id?: string
          peak_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          conditions?: string | null
          created_at?: string | null
          date_climbed?: string | null
          id?: string
          peak_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reviews_profile_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_summits: {
        Row: {
          conditions: string | null
          created_at: string | null
          date_summited: string
          id: string
          notes: string | null
          party_size: number | null
          peak_id: string
          route_id: string | null
          start_time: string | null
          summit_time: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conditions?: string | null
          created_at?: string | null
          date_summited: string
          id?: string
          notes?: string | null
          party_size?: number | null
          peak_id: string
          route_id?: string | null
          start_time?: string | null
          summit_time?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conditions?: string | null
          created_at?: string | null
          date_summited?: string
          id?: string
          notes?: string | null
          party_size?: number | null
          peak_id?: string
          route_id?: string | null
          start_time?: string | null
          summit_time?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_summits_peak_id_fkey"
            columns: ["peak_id"]
            isOneToOne: false
            referencedRelation: "peaks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_summits_profile_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_summits_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
