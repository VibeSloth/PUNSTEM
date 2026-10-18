CREATE TABLE `function_sprint_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `function_sprint_sessions` ADD `user_id` text;--> statement-breakpoint
CREATE INDEX `idx_function_sprint_user_created` ON `function_sprint_sessions` (`user_id`,`created_at`);