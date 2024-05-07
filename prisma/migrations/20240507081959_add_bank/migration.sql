/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bank_shortName_key` ON `Bank`(`shortName`);
