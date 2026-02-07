CREATE TABLE `program_coordinators` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`program_schedule_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned,
	`role` varchar(255) NOT NULL,
	`name` varchar(255),
	CONSTRAINT `program_coordinators_id` PRIMARY KEY(`id`),
	CONSTRAINT `program_coordinators_program_schedule_id_name_unique` UNIQUE(`program_schedule_id`,`name`),
	CONSTRAINT `program_coordinators_program_schedule_id_user_id_unique` UNIQUE(`program_schedule_id`,`user_id`)
);
--> statement-breakpoint
ALTER TABLE `program_coordinators` ADD CONSTRAINT `program_coordinators_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `program_coordinators` ADD CONSTRAINT `program_coordinators_program_schedule_id_program_schedules_id_fk` FOREIGN KEY (`program_schedule_id`) REFERENCES `program_schedules`(`id`) ON DELETE cascade ON UPDATE cascade;