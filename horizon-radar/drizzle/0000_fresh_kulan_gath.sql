CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."member_style" AS ENUM('free', 'premium', 'admin');--> statement-breakpoint
CREATE TYPE "public"."newsletter_source" AS ENUM('footer_popout', 'admin_add');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('subscribed', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."reading_level" AS ENUM('novice', 'technical', 'analyst');--> statement-breakpoint
CREATE TYPE "public"."research_card_category" AS ENUM('recently-published', 'most-read', 'trending');--> statement-breakpoint
CREATE TYPE "public"."research_request_status" AS ENUM('new', 'worth_considering', 'unworthy', 'completed');--> statement-breakpoint
CREATE TYPE "public"."research_request_type" AS ENUM('informal', 'formal');--> statement-breakpoint
CREATE TYPE "public"."tokenomics_status" AS ENUM('good', 'neutral', 'bad');--> statement-breakpoint
CREATE TABLE "admin_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"data" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_abstracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"content" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_architecture_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"content" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_content_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"reading_level" "reading_level" NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"credential" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_ecosystem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"ecosystem_item" varchar(100) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"event_date" varchar(50),
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"title" varchar(255),
	"image_url" varchar(500) NOT NULL,
	"aspect_ratio" varchar(20),
	"caption" text,
	"width" integer,
	"height" integer,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"content" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_official_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"link_type" varchar(20) NOT NULL,
	"platform" varchar(50),
	"url" varchar(500) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_radar_ratings" (
	"article_id" uuid PRIMARY KEY NOT NULL,
	"growth_potential" integer NOT NULL,
	"investment_opportunity" integer NOT NULL,
	"member_opinions" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_reading_levels" (
	"article_id" uuid NOT NULL,
	"reading_level" "reading_level" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_stats" (
	"article_id" uuid PRIMARY KEY NOT NULL,
	"tvl" varchar(50),
	"volume" varchar(50),
	"users" varchar(50),
	"capital" varchar(50),
	"opinions" varchar(50),
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_table_of_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"content" varchar(255) NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"article_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" varchar(100) NOT NULL,
	"twitter" varchar(255),
	"linkedin" varchar(255),
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_tokenomics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"category" varchar(100) NOT NULL,
	"percentage" integer NOT NULL,
	"status" "tokenomics_status" NOT NULL,
	"order_index" integer NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"ticker" varchar(20),
	"subtitle" text,
	"classification" varchar(100),
	"location" varchar(100),
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"author" varchar(100) NOT NULL,
	"featured_image" varchar(500),
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"article_slug" varchar(100) NOT NULL,
	"article_title" varchar(255) NOT NULL,
	"author" varchar(100) NOT NULL,
	"author_id" uuid,
	"author_initials" varchar(10) NOT NULL,
	"author_color" varchar(7) NOT NULL,
	"content" text NOT NULL,
	"parent_id" uuid,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "database_migrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"migration_name" varchar(255) NOT NULL,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "database_migrations_migration_name_unique" UNIQUE("migration_name")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" varchar(255) NOT NULL,
	"name" varchar(100) NOT NULL,
	"source" "newsletter_source" DEFAULT 'footer_popout' NOT NULL,
	"status" "newsletter_status" DEFAULT 'subscribed' NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "protocol_categories" (
	"protocol_slug" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_chains" (
	"protocol_slug" varchar(100) NOT NULL,
	"chain" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol_slug" varchar(100) NOT NULL,
	"as_of" timestamp NOT NULL,
	"tvl" integer,
	"volume_24h" integer,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocols" (
	"slug" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ticker" varchar(20),
	"status" varchar(100),
	"premium" boolean DEFAULT false NOT NULL,
	"radar_rating" integer,
	"growth_potential" varchar(50),
	"last_updated" timestamp,
	"investment_opportunity_text" text,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_card_tags" (
	"research_card_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"growth_score" numeric(3, 1),
	"opportunity_score" numeric(3, 1),
	"slug" varchar(100) NOT NULL,
	"banner_image" varchar(500),
	"category" "research_card_category" NOT NULL,
	"published_at" timestamp,
	"view_count" integer DEFAULT 0 NOT NULL,
	"author" varchar(100) NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "research_cards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "research_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "research_request_type" NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"website" varchar(500),
	"twitter" varchar(255),
	"docs_link" varchar(500),
	"helpful_link1" varchar(500),
	"helpful_link2" varchar(500),
	"notes" text,
	"contract_address" varchar(255),
	"chain" varchar(100),
	"category" varchar(100),
	"problem_statement" text,
	"key_risks" text,
	"docs_links" text,
	"submitted_by" uuid,
	"status" "research_request_status" DEFAULT 'new' NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_articles" integer DEFAULT 0 NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"total_comments" integer DEFAULT 0 NOT NULL,
	"total_protocols" integer DEFAULT 0 NOT NULL,
	"total_research_requests" integer DEFAULT 0 NOT NULL,
	"total_newsletter_subscriptions" integer DEFAULT 0 NOT NULL,
	"last_backup" timestamp DEFAULT now() NOT NULL,
	"version" varchar(20) DEFAULT '1.0.0' NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"reading_level" "reading_level" DEFAULT 'novice' NOT NULL,
	"notifications" boolean DEFAULT true NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"avatar" varchar(500),
	"bio" text,
	"twitter" varchar(255),
	"linkedin" varchar(255),
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_watchlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"article_id" uuid NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"member_style" "member_style" DEFAULT 'free' NOT NULL,
	"duration" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	"updated_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "article_abstracts" ADD CONSTRAINT "article_abstracts_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_architecture_sections" ADD CONSTRAINT "article_architecture_sections_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_content_sections" ADD CONSTRAINT "article_content_sections_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_credentials" ADD CONSTRAINT "article_credentials_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_ecosystem" ADD CONSTRAINT "article_ecosystem_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_events" ADD CONSTRAINT "article_events_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_images" ADD CONSTRAINT "article_images_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_mechanics" ADD CONSTRAINT "article_mechanics_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_official_links" ADD CONSTRAINT "article_official_links_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_radar_ratings" ADD CONSTRAINT "article_radar_ratings_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_reading_levels" ADD CONSTRAINT "article_reading_levels_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_stats" ADD CONSTRAINT "article_stats_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_table_of_contents" ADD CONSTRAINT "article_table_of_contents_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_team_members" ADD CONSTRAINT "article_team_members_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_tokenomics" ADD CONSTRAINT "article_tokenomics_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_categories" ADD CONSTRAINT "protocol_categories_protocol_slug_protocols_slug_fk" FOREIGN KEY ("protocol_slug") REFERENCES "public"."protocols"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_chains" ADD CONSTRAINT "protocol_chains_protocol_slug_protocols_slug_fk" FOREIGN KEY ("protocol_slug") REFERENCES "public"."protocols"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD CONSTRAINT "protocol_metric_snapshots_protocol_slug_protocols_slug_fk" FOREIGN KEY ("protocol_slug") REFERENCES "public"."protocols"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_card_tags" ADD CONSTRAINT "research_card_tags_research_card_id_research_cards_id_fk" FOREIGN KEY ("research_card_id") REFERENCES "public"."research_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_card_tags" ADD CONSTRAINT "research_card_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_requests" ADD CONSTRAINT "research_requests_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_watchlists" ADD CONSTRAINT "user_watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;