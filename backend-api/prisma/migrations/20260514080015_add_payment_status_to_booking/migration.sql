-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
ALTER COLUMN "status" SET DEFAULT 'Pending';
