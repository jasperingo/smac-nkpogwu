CREATE TABLE `group_members` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`user_id` bigint unsigned NOT NULL,
	`group_id` bigint unsigned NOT NULL,
	CONSTRAINT `group_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `group_members_user_id_group_id_unique` UNIQUE(`user_id`,`group_id`)
);
--> statement-breakpoint
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_group_id_groups_id_fk` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE cascade ON UPDATE cascade;