// ⚠️ STAND-IN FILE — NOT MACHINE-GENERATED, BUT VERIFIED AGAINST THE REAL
// LIVE DATABASE.
//
// This file should be produced by `npm run db:types`, which runs:
//   supabase gen types typescript --local > lib/supabase/database.types.ts
//
// `--local` and `--db-url` both need a running Docker/Podman instance in
// this CLI version (the latter shells out to Docker even against a remote
// database), and `--project-id` needs a Supabase personal access token
// (SUPABASE_ACCESS_TOKEN) — neither was available in the environment this
// file was authored/verified in. Instead, every table's exact columns,
// types, and nullability were queried directly from
// information_schema.columns against the real, live project
// (qorpimkeqevgokygftfa) on 2026-09-13 (and again on 2026-09-17, for the
// nine tables 20260917100000_new_sections_schema.sql added — same method,
// same constraint) and diffed against this file
// field-by-field — this is not a guess transcribed from the migration
// files, it's confirmed against the database those migrations actually
// produced.
//
// Treat this as provisional anyway: the first time anyone has Docker (or
// a SUPABASE_ACCESS_TOKEN) available, run `npm run db:types` for real and
// commit the regenerated file over this one. Per CLAUDE.md rule 5, this
// file is normally never hand-edited — this header exists so nobody
// mistakes this stand-in for that rule being followed.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Required by current @supabase/postgrest-js versions for its type-level
  // select-string parser (GetResult) to resolve non-trivial column lists;
  // without it, some selects silently infer as `never`. The real generator
  // fills this in from the linked project's PostgREST version — this value
  // is a placeholder until `npm run db:types` runs for real.
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      compliance_disclaimers: {
        Row: {
          key: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          body?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      program_families: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          accent_token: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          accent_token?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          tagline?: string | null;
          accent_token?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          family_id: string;
          slug: string;
          name: string;
          headline: string;
          summary: string;
          duration_label: string | null;
          hero_image_url: string | null;
          banner_image_url: string | null;
          accent_token: string | null;
          disclaimer_key: string;
          is_published: boolean;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image_url: string | null;
          canonical_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          slug: string;
          name: string;
          headline: string;
          summary: string;
          duration_label?: string | null;
          hero_image_url?: string | null;
          banner_image_url?: string | null;
          accent_token?: string | null;
          disclaimer_key: string;
          is_published?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          slug?: string;
          name?: string;
          headline?: string;
          summary?: string;
          duration_label?: string | null;
          hero_image_url?: string | null;
          banner_image_url?: string | null;
          accent_token?: string | null;
          disclaimer_key?: string;
          is_published?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programs_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "program_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "programs_disclaimer_key_fkey";
            columns: ["disclaimer_key"];
            isOneToOne: false;
            referencedRelation: "compliance_disclaimers";
            referencedColumns: ["key"];
          },
        ];
      };
      program_modules: {
        Row: {
          id: string;
          program_id: string;
          title: string;
          description: string | null;
          icon_key: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          title: string;
          description?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          title?: string;
          description?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_modules_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      program_module_items: {
        Row: {
          id: string;
          module_id: string;
          label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          label: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          label?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_module_items_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "program_modules";
            referencedColumns: ["id"];
          },
        ];
      };
      program_audiences: {
        Row: {
          id: string;
          program_id: string;
          label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          label: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          label?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_audiences_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      program_journey_steps: {
        Row: {
          id: string;
          program_id: string;
          step_label: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          step_label: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          step_label?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "program_journey_steps_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      mentors: {
        Row: {
          id: string;
          slug: string;
          full_name: string;
          role_title: string | null;
          qualification: string | null;
          institution: string | null;
          bio: string | null;
          photo_url: string | null;
          publications_count: number;
          linkedin_url: string | null;
          is_leadership: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          full_name: string;
          role_title?: string | null;
          qualification?: string | null;
          institution?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          publications_count?: number;
          linkedin_url?: string | null;
          is_leadership?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          full_name?: string;
          role_title?: string | null;
          qualification?: string | null;
          institution?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          publications_count?: number;
          linkedin_url?: string | null;
          is_leadership?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_title: string | null;
          author_photo_url: string | null;
          program_id: string | null;
          quote: string;
          rating: number;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_title?: string | null;
          author_photo_url?: string | null;
          program_id?: string | null;
          quote: string;
          rating: number;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_title?: string | null;
          author_photo_url?: string | null;
          program_id?: string | null;
          quote?: string;
          rating?: number;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body_mdx: string;
          cover_image_url: string | null;
          cover_image_alt: string;
          author_id: string | null;
          category_id: string | null;
          reading_minutes: number | null;
          status: string;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image_url: string | null;
          canonical_path: string | null;
          schema_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body_mdx: string;
          cover_image_url?: string | null;
          cover_image_alt: string;
          author_id?: string | null;
          category_id?: string | null;
          reading_minutes?: number | null;
          status?: string;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          schema_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          body_mdx?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string;
          author_id?: string | null;
          category_id?: string | null;
          reading_minutes?: number | null;
          status?: string;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          schema_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "mentors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      study_field_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_fields: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          overview: string | null;
          typical_universities: string | null;
          entry_requirements: string | null;
          language_requirements: string | null;
          career_outlook: string | null;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image_url: string | null;
          canonical_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name: string;
          overview?: string | null;
          typical_universities?: string | null;
          entry_requirements?: string | null;
          language_requirements?: string | null;
          career_outlook?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name?: string;
          overview?: string | null;
          typical_universities?: string | null;
          entry_requirements?: string | null;
          language_requirements?: string | null;
          career_outlook?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_fields_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "study_field_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      webinars: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          speaker_id: string | null;
          starts_at: string;
          duration_minutes: number;
          platform: string;
          join_url: string | null;
          cover_image_url: string | null;
          capacity: number | null;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image_url: string | null;
          canonical_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          speaker_id?: string | null;
          starts_at: string;
          duration_minutes?: number;
          platform?: string;
          join_url?: string | null;
          cover_image_url?: string | null;
          capacity?: number | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          speaker_id?: string | null;
          starts_at?: string;
          duration_minutes?: number;
          platform?: string;
          join_url?: string | null;
          cover_image_url?: string | null;
          capacity?: number | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image_url?: string | null;
          canonical_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "webinars_speaker_id_fkey";
            columns: ["speaker_id"];
            isOneToOne: false;
            referencedRelation: "mentors";
            referencedColumns: ["id"];
          },
        ];
      };
      webinar_registrations: {
        Row: {
          id: string;
          webinar_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          webinar_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          webinar_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey";
            columns: ["webinar_id"];
            isOneToOne: false;
            referencedRelation: "webinars";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          country: string | null;
          current_status: string | null;
          interest_type: string | null;
          program_id: string | null;
          message: string | null;
          source_page: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          status: string;
          admin_notes: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          country?: string | null;
          current_status?: string | null;
          interest_type?: string | null;
          program_id?: string | null;
          message?: string | null;
          source_page?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          country?: string | null;
          current_status?: string | null;
          interest_type?: string | null;
          program_id?: string | null;
          message?: string | null;
          source_page?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          description: string | null;
          hero_image_url: string | null;
          format_label: string | null;
          certification_label: string | null;
          disclaimer_key: string;
          is_published: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          format_label?: string | null;
          certification_label?: string | null;
          disclaimer_key: string;
          is_published?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          format_label?: string | null;
          certification_label?: string | null;
          disclaimer_key?: string;
          is_published?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_disclaimer_key_fkey";
            columns: ["disclaimer_key"];
            isOneToOne: false;
            referencedRelation: "compliance_disclaimers";
            referencedColumns: ["key"];
          },
        ];
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          module_number: number;
          title: string;
          key_takeaway: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          module_number: number;
          title: string;
          key_takeaway?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          module_number?: number;
          title?: string;
          key_takeaway?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      course_lessons: {
        Row: {
          id: string;
          module_id: string;
          lesson_number: string | null;
          title: string;
          topics: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          lesson_number?: string | null;
          title: string;
          topics?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          lesson_number?: string | null;
          title?: string;
          topics?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "course_modules";
            referencedColumns: ["id"];
          },
        ];
      };
      initiatives: {
        Row: {
          id: string;
          slug: string;
          name: string;
          mission: string | null;
          vision: string | null;
          tagline: string | null;
          description: string | null;
          hero_image_url: string | null;
          accent_token: string | null;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          mission?: string | null;
          vision?: string | null;
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          accent_token?: string | null;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          mission?: string | null;
          vision?: string | null;
          tagline?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          accent_token?: string | null;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      initiative_sections: {
        Row: {
          id: string;
          initiative_id: string;
          title: string;
          description: string | null;
          icon_key: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          initiative_id: string;
          title: string;
          description?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          initiative_id?: string;
          title?: string;
          description?: string | null;
          icon_key?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "initiative_sections_initiative_id_fkey";
            columns: ["initiative_id"];
            isOneToOne: false;
            referencedRelation: "initiatives";
            referencedColumns: ["id"];
          },
        ];
      };
      initiative_section_items: {
        Row: {
          id: string;
          section_id: string;
          label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          label: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          label?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "initiative_section_items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "initiative_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      support_services: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string | null;
          description: string | null;
          disclaimer_key: string;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          summary?: string | null;
          description?: string | null;
          disclaimer_key: string;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          summary?: string | null;
          description?: string | null;
          disclaimer_key?: string;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_services_disclaimer_key_fkey";
            columns: ["disclaimer_key"];
            isOneToOne: false;
            referencedRelation: "compliance_disclaimers";
            referencedColumns: ["key"];
          },
        ];
      };
      support_service_offerings: {
        Row: {
          id: string;
          service_id: string;
          title: string;
          description: string | null;
          is_free: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          title: string;
          description?: string | null;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          title?: string;
          description?: string | null;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_service_offerings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "support_services";
            referencedColumns: ["id"];
          },
        ];
      };
      crisis_resources: {
        Row: {
          id: string;
          country: string;
          organisation: string;
          phone: string;
          hours: string | null;
          notes: string | null;
          verified_on: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          country: string;
          organisation: string;
          phone: string;
          hours?: string | null;
          notes?: string | null;
          verified_on: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          country?: string;
          organisation?: string;
          phone?: string;
          hours?: string | null;
          notes?: string | null;
          verified_on?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    // `{ [_ in never]: never }` (an empty object type), not
    // `Record<string, never>` (an index signature) — postgrest-js
    // intersects Tables with Views internally, and an index-signature
    // type in that intersection forces every table to collapse to
    // `never`. This is exactly how the real generator emits "no views".
    Views: { [_ in never]: never };
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// ── Convenience helpers (mirrors what `supabase gen types` emits) ─────────

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];
