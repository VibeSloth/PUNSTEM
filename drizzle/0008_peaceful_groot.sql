CREATE TABLE `practice_days` (
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `day`)
);
