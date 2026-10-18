ALTER TABLE `usage_events` ADD `user_id` text;--> statement-breakpoint
CREATE INDEX `idx_usage_events_user_created` ON `usage_events` (`user_id`,`created_at`);