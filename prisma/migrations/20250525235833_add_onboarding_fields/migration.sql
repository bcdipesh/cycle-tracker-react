-- CreateEnum
CREATE TYPE "TrackingGoal" AS ENUM ('GENERAL', 'CONCEPTION', 'CONTRACEPTION', 'HEALTH');

-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "averagePeriodLength" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "trackingGoal" "TrackingGoal" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
