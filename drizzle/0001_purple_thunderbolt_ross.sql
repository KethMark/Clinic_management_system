ALTER TABLE `consultations` RENAME COLUMN `student_id` TO `studentId`;--> statement-breakpoint
ALTER TABLE `medicines` RENAME COLUMN `student_id` TO `studentId`;--> statement-breakpoint
ALTER TABLE `students` RENAME COLUMN `user_id` TO `userId`;--> statement-breakpoint
ALTER TABLE `students` MODIFY COLUMN `userId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medicines` ADD CONSTRAINT `medicines_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;