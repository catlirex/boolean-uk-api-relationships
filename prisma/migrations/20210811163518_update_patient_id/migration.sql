/*
  Warnings:

  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `patient_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "patientId",
ADD COLUMN     "patient_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
