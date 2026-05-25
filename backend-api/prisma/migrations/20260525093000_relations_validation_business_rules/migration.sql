CREATE TYPE "BookingStatus" AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
CREATE TYPE "BookingPaymentStatus" AS ENUM ('Unpaid', 'DepositPaid', 'FullyPaid', 'Refunded');
CREATE TYPE "EnquiryStatus" AS ENUM ('New', 'Contacted', 'Closed');
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');
CREATE TYPE "PaymentMethod" AS ENUM ('BankTransfer', 'FPX', 'TouchNGoEWallet', 'CreditDebitCard', 'Cash');

ALTER TABLE "Service"
  ADD COLUMN "durationMin" INTEGER NOT NULL DEFAULT 60,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "price" TYPE DECIMAL(10,2) USING "price"::DECIMAL(10,2);

ALTER TABLE "Booking"
  ADD COLUMN "serviceId" TEXT,
  ADD COLUMN "serviceName" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "BookingStatus" USING (
    CASE
      WHEN LOWER("status") = 'confirmed' THEN 'Confirmed'
      WHEN LOWER("status") = 'completed' THEN 'Completed'
      WHEN LOWER("status") = 'cancelled' THEN 'Cancelled'
      ELSE 'Pending'
    END
  )::"BookingStatus",
  ALTER COLUMN "status" SET DEFAULT 'Pending',
  ALTER COLUMN "paymentStatus" DROP DEFAULT,
  ALTER COLUMN "paymentStatus" TYPE "BookingPaymentStatus" USING (
    CASE
      WHEN LOWER("paymentStatus") IN ('deposit paid', 'depositpaid') THEN 'DepositPaid'
      WHEN LOWER("paymentStatus") IN ('fully paid', 'fullypaid', 'paid') THEN 'FullyPaid'
      WHEN LOWER("paymentStatus") = 'refunded' THEN 'Refunded'
      ELSE 'Unpaid'
    END
  )::"BookingPaymentStatus",
  ALTER COLUMN "paymentStatus" SET DEFAULT 'Unpaid';

UPDATE "Booking" SET "serviceName" = COALESCE("serviceName", "service", 'Unspecified Service');

ALTER TABLE "Booking" ALTER COLUMN "serviceName" SET NOT NULL;

UPDATE "Booking"
SET "serviceId" = "Service"."id"
FROM "Service"
WHERE LOWER("Booking"."serviceName") = LOWER("Service"."name");

ALTER TABLE "Enquiry"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "EnquiryStatus" USING (
    CASE
      WHEN LOWER("status") = 'contacted' THEN 'Contacted'
      WHEN LOWER("status") = 'closed' THEN 'Closed'
      ELSE 'New'
    END
  )::"EnquiryStatus",
  ALTER COLUMN "status" SET DEFAULT 'New';

ALTER TABLE "Payment"
  ALTER COLUMN "amount" TYPE DECIMAL(10,2) USING "amount"::DECIMAL(10,2),
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "PaymentStatus" USING (
    CASE
      WHEN LOWER("status") = 'paid' THEN 'Paid'
      WHEN LOWER("status") = 'failed' THEN 'Failed'
      WHEN LOWER("status") = 'refunded' THEN 'Refunded'
      ELSE 'Pending'
    END
  )::"PaymentStatus",
  ALTER COLUMN "status" SET DEFAULT 'Pending',
  ALTER COLUMN "method" TYPE "PaymentMethod" USING (
    CASE
      WHEN LOWER("method") = 'fpx' THEN 'FPX'
      WHEN LOWER("method") IN ('touch n go ewallet', 'touchngoewallet') THEN 'TouchNGoEWallet'
      WHEN LOWER("method") IN ('credit / debit card', 'creditdebitcard') THEN 'CreditDebitCard'
      WHEN LOWER("method") = 'cash' THEN 'Cash'
      ELSE 'BankTransfer'
    END
  )::"PaymentMethod";

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");
CREATE INDEX "Booking_appointment_idx" ON "Booking"("appointment");
CREATE UNIQUE INDEX "Booking_appointment_serviceId_key" ON "Booking"("appointment", "serviceId");
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");
CREATE INDEX "Service_active_idx" ON "Service"("active");
CREATE INDEX "Service_category_idx" ON "Service"("category");
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
