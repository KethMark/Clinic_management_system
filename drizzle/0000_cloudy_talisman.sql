CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`symptoms` text,
	`diagnosis` text,
	`treatment_given` text,
	`medrx_dispensed` text,
	`attending_staff` varchar(255),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicines` (
	`id` varchar(255) NOT NULL,
	`student_id` varchar(255) NOT NULL,
	`medicine_full_name` varchar(255) NOT NULL,
	`type` varchar(100),
	`quantity` int,
	`unit` varchar(50),
	`expires_date` timestamp,
	`status` enum('Active','Expired','Used','Unavailable') DEFAULT 'Active',
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `medicines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`full_name` varchar(255) NOT NULL,
	`grade` varchar(50),
	`section` varchar(50),
	`age` int,
	`gender` enum('Male','Female','Other') NOT NULL,
	`blood_type` varchar(10),
	`allergies` text,
	`medical_history` text,
	`emergency_contact` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `students_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`password` varchar(255),
	`emailVerified` timestamp(3),
	`image` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;