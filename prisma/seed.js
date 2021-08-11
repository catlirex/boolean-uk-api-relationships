const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  buildDoctorDatabase,
  buildAppointmentDatabase,
} = require("../src/utils/mockdata");

async function seed() {
  const doctorList = buildDoctorDatabase();

  for (const doctor of doctorList) {
    const createdData = await prisma.doctor.create({
      data: doctor,
    });

    console.log(createdData);
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
