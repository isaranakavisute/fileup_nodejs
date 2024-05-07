/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - Made the column `createdAt` on table `package` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `package` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `package` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Package_name_key` ON `Package`(`name`);
