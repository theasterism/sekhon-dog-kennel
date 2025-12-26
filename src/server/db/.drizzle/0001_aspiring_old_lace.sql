ALTER TABLE `session` RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE `session` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `session` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "displayUsername" TO "display_username";