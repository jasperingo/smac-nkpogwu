ALTER TABLE `roles` DROP INDEX `roles_name_unique`;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_name_group_id_unique` UNIQUE(`name`,`group_id`);