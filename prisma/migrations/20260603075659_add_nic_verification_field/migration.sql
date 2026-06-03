-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "nicBack" TEXT,
ADD COLUMN     "nicFront" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isNicVerified" BOOLEAN NOT NULL DEFAULT false;
