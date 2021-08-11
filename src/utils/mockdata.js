const faker = require("faker");

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
        appointments: {
          create: [
            {
              practice_name: faker.company.companyName() + " Clinic",
              date: faker.date.future(),
              reason: faker.lorem.sentence(),
            },
          ],
        },
      };

      doctors.push(doctor);
    }
  }

  return doctors;
}

module.exports = {
  buildDoctorDatabase,
};
