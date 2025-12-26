ALTER TABLE `session` ADD `user_id` integer NOT NULL REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);