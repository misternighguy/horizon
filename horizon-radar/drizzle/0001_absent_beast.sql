CREATE TYPE "public"."event_type" AS ENUM('testnet', 'mainnet', 'raise', 'product_launch', 'chain_launch', 'audit', 'other');--> statement-breakpoint
CREATE TYPE "public"."link_group" AS ENUM('social', 'technical');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status_active" AS ENUM('active', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."protocol_section_key" AS ENUM('abstract', 'architecture', 'mechanics.deposit', 'mechanics.withdraw', 'mechanics.incentives', 'mechanics.riskEngine', 'problemUsersValue.problem', 'problemUsersValue.users', 'problemUsersValue.value', 'tokenomics', 'authorSources', 'disclaimer', 'community');--> statement-breakpoint
CREATE TYPE "public"."research_request_status_new" AS ENUM('new', 'triaged', 'in_progress', 'published', 'rejected');--> statement-breakpoint
CREATE TABLE "article_problem_users_value" (
	"article_id" uuid PRIMARY KEY NOT NULL,
	"problem" text NOT NULL,
	"approach" text NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_puv_assumptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"assumption" text NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_puv_differentiators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"differentiator" text NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_puv_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"user_label" varchar(255) NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chains_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_architecture_tags_map" (
	"article_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_categories_new" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "protocol_categories_new_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "protocol_category_map" (
	"protocol_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_chain_map" (
	"protocol_id" uuid NOT NULL,
	"chain_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_section_copies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol_id" uuid NOT NULL,
	"section_key" "protocol_section_key" NOT NULL,
	"reading_level" "reading_level" NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"order_index" integer DEFAULT 1 NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_card_tags_map" (
	"card_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_meta" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"version" varchar(20) NOT NULL,
	"last_backup" timestamp DEFAULT now() NOT NULL,
	"total_articles" integer DEFAULT 0 NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"total_comments" integer DEFAULT 0 NOT NULL,
	"total_protocols" integer DEFAULT 0 NOT NULL,
	"total_research_requests" integer DEFAULT 0 NOT NULL,
	"total_newsletter_subscriptions" integer DEFAULT 0 NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokenomics_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"category" varchar(100) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"status" "tokenomics_status" NOT NULL,
	"created_at_utc" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "article_abstracts" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "article_architecture_sections" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "article_credentials" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "article_ecosystem" ADD COLUMN "label" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "article_events" ADD COLUMN "type" "event_type" DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "article_events" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "article_events" ADD COLUMN "date_text" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "article_mechanics" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "article_official_links" ADD COLUMN "group" "link_group" DEFAULT 'social' NOT NULL;--> statement-breakpoint
ALTER TABLE "article_official_links" ADD COLUMN "kind" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "article_reading_levels" ADD COLUMN "level" "reading_level" NOT NULL;--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "tvl_text" varchar(50);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "volume_text" varchar(50);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "users_text" varchar(50);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "capital_text" varchar(50);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "opinions_text" varchar(50);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "tvl_usd" numeric(20, 2);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "volume_usd" numeric(20, 2);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "users_count" integer;--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "capital_raised_usd" numeric(20, 2);--> statement-breakpoint
ALTER TABLE "article_stats" ADD COLUMN "opinions_count" integer;--> statement-breakpoint
ALTER TABLE "article_team_members" ADD COLUMN "twitter_url" varchar(255);--> statement-breakpoint
ALTER TABLE "article_team_members" ADD COLUMN "linkedin_url" varchar(255);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "author_name" varchar(100);--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD COLUMN "source_text" varchar(100);--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD COLUMN "subscribed_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD COLUMN "unsubscribed_at" timestamp;--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD COLUMN "status_active" "newsletter_status_active" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD COLUMN "protocol_id" uuid;--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD COLUMN "as_of_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD COLUMN "tvl_usd" numeric(20, 2);--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD COLUMN "volume_24h_usd" numeric(20, 2);--> statement-breakpoint
ALTER TABLE "protocols" ADD COLUMN "id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "protocols" ADD COLUMN "last_updated_date" date;--> statement-breakpoint
ALTER TABLE "research_cards" ADD COLUMN "author_text" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "research_cards" ADD COLUMN "article_id" uuid;--> statement-breakpoint
ALTER TABLE "research_requests" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "research_requests" ADD COLUMN "topic" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "research_requests" ADD COLUMN "details" text NOT NULL;--> statement-breakpoint
ALTER TABLE "research_requests" ADD COLUMN "priority" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "avatar_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "twitter_url" varchar(255);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "linkedin_url" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "duration_months" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "article_problem_users_value" ADD CONSTRAINT "article_problem_users_value_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_puv_assumptions" ADD CONSTRAINT "article_puv_assumptions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_puv_differentiators" ADD CONSTRAINT "article_puv_differentiators_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_puv_users" ADD CONSTRAINT "article_puv_users_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_architecture_tags_map" ADD CONSTRAINT "product_architecture_tags_map_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_architecture_tags_map" ADD CONSTRAINT "product_architecture_tags_map_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_category_map" ADD CONSTRAINT "protocol_category_map_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_category_map" ADD CONSTRAINT "protocol_category_map_category_id_protocol_categories_new_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."protocol_categories_new"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_chain_map" ADD CONSTRAINT "protocol_chain_map_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_chain_map" ADD CONSTRAINT "protocol_chain_map_chain_id_chains_id_fk" FOREIGN KEY ("chain_id") REFERENCES "public"."chains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_section_copies" ADD CONSTRAINT "protocol_section_copies_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_card_tags_map" ADD CONSTRAINT "research_card_tags_map_card_id_research_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."research_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_card_tags_map" ADD CONSTRAINT "research_card_tags_map_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokenomics_allocations" ADD CONSTRAINT "tokenomics_allocations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protocol_metric_snapshots" ADD CONSTRAINT "protocol_metric_snapshots_protocol_id_protocols_id_fk" FOREIGN KEY ("protocol_id") REFERENCES "public"."protocols"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_cards" ADD CONSTRAINT "research_cards_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;