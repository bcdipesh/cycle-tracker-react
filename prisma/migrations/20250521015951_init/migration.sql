-- CreateTable
CREATE TABLE "PeriodLog" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodLog_pkey" PRIMARY KEY ("id")
);
