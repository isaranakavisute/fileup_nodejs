/*
  Warnings:

  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `lastName`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL;
