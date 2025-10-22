CREATE TABLE `program_activities` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`program_schedule_id` bigint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	CONSTRAINT `program_activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `program_activities_program_schedule_id_name_unique` UNIQUE(`program_schedule_id`,`name`)
);
--> statement-breakpoint
ALTER TABLE `program_activities` ADD CONSTRAINT `program_activities_program_schedule_id_program_schedules_id_fk` FOREIGN KEY (`program_schedule_id`) REFERENCES `program_schedules`(`id`) ON DELETE cascade ON UPDATE cascade;