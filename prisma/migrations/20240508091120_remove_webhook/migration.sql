/*
  Warnings:

  - You are about to drop the `webhookevent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `webhookevent` DROP FOREIGN KEY `WebhookEvent_transactionId_fkey`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE `webhookevent`;
