-- AlterTable
ALTER TABLE `user` ADD COLUMN `username` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `DailyUpload` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `uploads` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `DailyUpload_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyUpload` ADD CONSTRAINT `DailyUpload_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
