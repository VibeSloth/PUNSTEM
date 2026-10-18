CREATE TABLE `site_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`page` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_site_feedback_created` ON `site_feedback` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_site_feedback_user_created` ON `site_feedback` (`user_id`,`created_at`);