-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `walletId` INTEGER NOT NULL,
    `balanceBefore` DOUBLE NOT NULL,
    `balanceAfter` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Transaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `balance` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Wallet_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
