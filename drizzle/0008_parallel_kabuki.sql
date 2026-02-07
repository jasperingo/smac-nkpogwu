CREATE TABLE `role_assignees` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`role_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned,
	`group_member_id` bigint unsigned,
	CONSTRAINT `role_assignees_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_assignees_role_id_user_id_unique` UNIQUE(`role_id`,`user_id`),
	CONSTRAINT `role_assignees_role_id_group_member_id_unique` UNIQUE(`role_id`,`group_member_id`)
);
--> statement-breakpoint
ALTER TABLE `role_assignees` ADD CONSTRAINT `role_assignees_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `role_assignees` ADD CONSTRAINT `role_assignees_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `role_assignees` ADD CONSTRAINT `role_assignees_group_member_id_group_members_id_fk` FOREIGN KEY (`group_member_id`) REFERENCES `group_members`(`id`) ON DELETE cascade ON UPDATE cascade;