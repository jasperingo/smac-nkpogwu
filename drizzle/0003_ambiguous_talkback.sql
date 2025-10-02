CREATE TABLE `groups` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`parent_id` bigint unsigned,
	`name` varchar(255) NOT NULL,
	`description` text,
	`privacy` enum('PUBLIC','PRIVATE') NOT NULL DEFAULT 'PUBLIC',
	`spotlighted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `groups_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `groups` ADD CONSTRAINT `groups_parent_id_groups_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE cascade;