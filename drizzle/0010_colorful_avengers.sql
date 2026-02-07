CREATE TABLE `program_schedules` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_datetime` datetime NOT NULL DEFAULT now(),
	`updated_datetime` datetime,
	`program_id` bigint unsigned,
	`start_datetime` datetime NOT NULL,
	`end_datetime` datetime NOT NULL,
	`topic` varchar(255),
	`description` text,
	CONSTRAINT `program_schedules_id` PRIMARY KEY(`id`),
	CONSTRAINT `program_schedules_program_id_start_datetime_unique` UNIQUE(`program_id`,`start_datetime`),
	CONSTRAINT `program_schedules_program_id_end_datetime_unique` UNIQUE(`program_id`,`end_datetime`)
);
--> statement-breakpoint
ALTER TABLE `program_schedules` ADD CONSTRAINT `program_schedules_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE cascade ON UPDATE cascade;