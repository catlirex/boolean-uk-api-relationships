const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  buildDoctorDatabase,
  buildPatientDatabase,
  buildAppointmentDatabase,
} = require("../src/utils/mockdata");

async function seed() {
  const doctorList = buildDoctorDatabase();
  const doctorIds = [];
  for (const doctor of doctorList) {
    const createdDoctor = await prisma.doctor.create({
      data: doctor,
    });
    doctorIds.push(createdDoctor.id);
    console.log(createdDoctor);
  }

  const patientIds = [];
  const patientList = buildPatientDatabase();
  for (const patient of patientList) {
    const createdPatient = await prisma.patient.create({
      data: patient,
    });
    patientIds.push(createdPatient.id);
    console.log(createdPatient);
  }

  const appointmentList = buildAppointmentDatabase();

  for (const appointment of appointmentList) {
    const randomDoctorId = getRandomElement(doctorIds);
    const randomPatientIds = getRandomElement(patientIds);
    const data = {
      ...appointment,
      doctor: { connect: { id: randomDoctorId } },
      patient: { connect: { id: randomPatientIds } },
    };

    const createdAppointment = await prisma.appointment.create({ data });

    console.log(createdAppointment);
  }
}

function getRandomElement(array) {
  const number = Math.floor(Math.random() * array.length);
  return array[number];
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
