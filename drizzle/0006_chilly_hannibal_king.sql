CREATE TABLE `auth_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_user` ON `auth_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_expires` ON `auth_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `local_accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`iterations` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `local_accounts_email_unique` ON `local_accounts` (`email`);