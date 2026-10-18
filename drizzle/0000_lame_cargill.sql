CREATE TABLE `duel_rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`host_token` text NOT NULL,
	`guest_token` text,
	`questions` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`round` integer DEFAULT 0 NOT NULL,
	`host_score` integer DEFAULT 0 NOT NULL,
	`guest_score` integer DEFAULT 0 NOT NULL,
	`last_winner` text,
	`winner` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
