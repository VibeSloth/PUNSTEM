CREATE TABLE `function_sprint_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`completed_on` text NOT NULL,
	`questions` integer NOT NULL,
	`first_correct` integer NOT NULL,
	`solved` integer NOT NULL,
	`misses` integer NOT NULL,
	`total_ms` integer NOT NULL,
	`created_at` integer NOT NULL
);
