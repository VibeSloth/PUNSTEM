CREATE TABLE `activity_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`page` text NOT NULL,
	`details` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_activity_created` ON `activity_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_activity_user_created` ON `activity_events` (`user_id`,`created_at`);