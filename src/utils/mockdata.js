const faker = require("faker");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildDoctorDatabase() {
  const specialties = [
    "General Surgery",
    "Hematology",
    "Neurosurgery",
    "Ophthalmology",
    "Plastic Surgeon",
    "General Psychiatrist",
    "Dentist",
  ];
  const doctors = [];

  for (const specialty of specialties) {
    for (let i = 0; i < 2; i++) {
      let doctor = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        specialty: specialty,
      };

      doctors.push(doctor);
    }
  }

  return doctors;
}

function buildPatientDatabase() {
  const patients = [];
  const patientNumber = getRandomInt(5, 15);

  for (let i = 0; i < patientNumber; i++) {
    let patient = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      birthday: faker.date.past(),
    };
    patients.push(patient);
  }

  return patients;
}

function buildAppointmentDatabase() {
  const appointments = [];
  const appointmentNumber = getRandomInt(10, 30);

  for (let i = 0; i < appointmentNumber; i++) {
    const appointment = {
      practice_name: faker.music.genre() + " Clinic",
      date: faker.date.soon(),
      reason: faker.lorem.sentence(),
    };

    appointments.push(appointment);
  }

  return appointments;
}

module.exports = {
  buildDoctorDatabase,
  buildPatientDatabase,
  buildAppointmentDatabase,
};
