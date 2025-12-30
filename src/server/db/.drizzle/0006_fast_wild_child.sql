PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_dog` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'Untitled' NOT NULL,
	`published_at` integer,
	`breed` text,
	`date_of_birth` integer,
	`gender` text,
	`size` text,
	`color` text,
	`weight` real,
	`description` text,
	`status` text DEFAULT 'available',
	`price` real,
	`microchipped` integer DEFAULT false,
	`vaccinations` text,
	`dewormings` integer DEFAULT 0,
	`vet_checked` integer DEFAULT false,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_dog`("id", "name", "published_at", "breed", "date_of_birth", "gender", "size", "color", "weight", "description", "status", "price", "microchipped", "vaccinations", "dewormings", "vet_checked", "created_at", "updated_at") SELECT "id", "name", "published_at", "breed", "date_of_birth", "gender", "size", "color", "weight", "description", "status", "price", "microchipped", "vaccinations", "dewormings", "vet_checked", "created_at", "updated_at" FROM `dog`;--> statement-breakpoint
DROP TABLE `dog`;--> statement-breakpoint
ALTER TABLE `__new_dog` RENAME TO `dog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;