/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `practiceName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `doctor_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practice_name` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `specialty` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorId",
DROP COLUMN "practiceName",
ADD COLUMN     "doctor_id" INTEGER NOT NULL,
ADD COLUMN     "practice_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ALTER COLUMN "specialty" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
