/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BLOCKED', 'UNBLOCKED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isBlocked",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UNBLOCKED';

-- DropEnum
DROP TYPE "IsBlocked";
