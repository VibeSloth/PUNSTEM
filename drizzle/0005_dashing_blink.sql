CREATE TABLE `usage_events` (
	`id` text PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`display_name` text,
	`page` text NOT NULL,
	`event_type` text NOT NULL,
	`occurred_on` text NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_usage_events_created` ON `usage_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_usage_events_page_day` ON `usage_events` (`page`,`occurred_on`);--> statement-breakpoint
CREATE INDEX `idx_usage_events_device_created` ON `usage_events` (`device_id`,`created_at`);--> statement-breakpoint
ALTER TABLE `function_sprint_sessions` ADD `section` text DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE `function_sprint_sessions` ADD `difficulty` text DEFAULT 'standard' NOT NULL;