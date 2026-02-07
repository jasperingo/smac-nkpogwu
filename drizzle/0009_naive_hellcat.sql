CREATE TABLE `programs` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`user_id` bigint unsigned,
	`group_id` bigint unsigned,
	`name` varchar(255) NOT NULL,
	`theme` varchar(255),
	`topic` varchar(255),
	`description` text,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `programs` ADD CONSTRAINT `programs_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `programs` ADD CONSTRAINT `programs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;