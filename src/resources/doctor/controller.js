const { doctor } = require("../../utils/database");
const prisma = require("../../utils/database");

function errorHandler(error, res) {
  console.log(error.message);
  if (error.message === "Cannot read property 'delete' of undefined")
    return res.status(400).json({ ERROR: "Delete target not found" });

  if (error.message.includes("invalid value"))
    return res.status(400).json({ ERROR: "Invalid value type found" });

  res
    .status(500)
    .json({ ERROR: "Internal server error please try again later" });
}

async function getAllDoctors(req, res) {
  try {
    const result = await selectDoctors();
    res.json(result);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectDoctors(filterContent, includeContent) {
  try {
    const result = await prisma.doctor.findMany({
      where: filterContent,
      include: includeContent,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function getOneDoctor(req, res) {
  const id = Number(req.params.id);

  try {
    const result = await prisma.doctor.findUnique({
      where: {
        id,
      },
    });
    if (result) res.json(result);
    else res.json({ msg: "Item not found" });
  } catch (e) {
    errorHandler(e, res);
  }
}

async function postOneDoctor(req, res) {
  const newDoctor = req.body;
  const { appointments } = newDoctor;
  const validDoctor = newDoctorChecker(newDoctor);
  console.log("validDoctor", validDoctor);
  if (!validDoctor)
    return res.status(400).json({ ERROR: "Doctor info invalid" });

  if (appointments) {
    const validAppointments = newDoctorAppointmentChecker(appointments);
    console.log("validAppointments", validAppointments);
    if (!validAppointments)
      return res.status(400).json({ ERROR: "Doctor info invalid" });
  }

  try {
    const createdDoctor = await createDoctorToServer(newDoctor);
    const result = await selectOneDoctorInclude(
      { id: createdDoctor.id },
      { appointments: true }
    );
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectOneDoctorInclude(filterContent, includeContent) {
  try {
    const result = await prisma.doctor.findUnique({
      where: filterContent,
      include: includeContent,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function createDoctorToServer(newDoctor) {
  const { first_name, last_name, specialty, appointments } = newDoctor;
  try {
    const result = await prisma.doctor.create({
      data: {
        first_name,
        last_name,
        specialty,
        appointments: { create: appointments },
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
}

function newDoctorChecker(doctorObject) {
  const newItemRequirements = ["first_name", "last_name", "specialty"];
  let lengthMatch = false;

  const hasAllKeys = newItemRequirements.every((item) =>
    doctorObject.hasOwnProperty(item)
  );

  if (doctorObject.appointments)
    Object.keys(doctorObject).length === newItemRequirements.length + 1
      ? (lengthMatch = true)
      : (lengthMatch = false);

  if (!doctorObject.appointments)
    Object.keys(doctorObject).length === newItemRequirements.length
      ? (lengthMatch = true)
      : (lengthMatch = false);

  console.log("hasAllKeys", hasAllKeys);
  console.log("lengthMatch", lengthMatch);

  if (hasAllKeys && lengthMatch) return true;
  else return false;
}

function newDoctorAppointmentChecker(appointments) {
  const newItemRequirements = ["practice_name", "date", "reason"];
  let isValid = false;
  for (const appointment of appointments) {
    const hasAllKeys = newItemRequirements.every((item) =>
      appointment.hasOwnProperty(item)
    );

    let lengthMatch = false;
    Object.keys(appointment).length === newItemRequirements.length
      ? (lengthMatch = true)
      : (lengthMatch = false);

    if (hasAllKeys && lengthMatch) isValid = true;
    console.log("in loop", isValid);
    if (!isValid) break;
  }
  console.log("before return", isValid);
  return isValid;
}

async function patchOneDoctor(req, res) {
  const id = Number(req.params.id);
  const toUpdateContent = req.body;
  try {
    const itemExist = await itemChecker(id);
    if (!itemExist) return res.json({ ERROR: `BOOK NOT FOUND bookId:${id}` });

    const contentValid = updateDoctorChecker(toUpdateContent);
    if (!contentValid) return res.json({ ERROR: `Update info incorrect` });

    const updatedBook = await updateDoctorToServer(id, toUpdateContent);
    res.json(updatedBook);
  } catch (e) {
    errorHandler(e, res);
  }
}
async function itemChecker(id) {
  try {
    const toUpdateItem = await prisma.doctor.findUnique({
      where: {
        id,
      },
    });
    if (toUpdateItem) return true;
    if (!toUpdateItem) return false;
  } catch (e) {
    throw e;
  }
}

function updateDoctorChecker(toUpdateObject) {
  const updateItemRequirements = ["id", "first_name", "last_name", "specialty"];

  for (const key of Object.keys(toUpdateObject)) {
    const keyChecker = updateItemRequirements.includes(key);
    if (!keyChecker) return false;
  }

  return true;
}

async function updateDoctorToServer(id, toUpdateContent) {
  try {
    const updatedDoctor = await prisma.doctor.update({
      where: {
        id,
      },
      data: toUpdateContent,
    });

    return updatedDoctor;
  } catch (e) {
    throw e;
  }
}

async function deleteOneDoctor(req, res) {
  const id = Number(req.params.id);
  try {
    const deletedDoctor = await prisma.doctor.delete({
      where: {
        id,
      },
    });

    res.json(deletedDoctor);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function getOneDoctorAppointment(req, res) {
  const id = Number(req.params.id);
  try {
    const appointments = await selectAppointmentData({ doctor_id: id });
    appointments.length
      ? res.json({ appointments })
      : res.json({ msg: "Nothing found" });
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectAppointmentData(filterContent) {
  try {
    const result = await prisma.appointment.findMany({
      where: filterContent,
    });

    return result;
  } catch (e) {
    throw e;
  }
}
async function getOneDoctorPractice(req, res) {
  const id = Number(req.params.id);
  try {
    const practiceList = await prisma.appointment.findMany({
      distinct: ["practice_name"],
      where: { doctor_id: id },
      select: { practice_name: true },
    });
    res.json(practiceList);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function getBusyDoctor(req, res) {
  try {
    const doctorsWithAppointment = await selectDoctorsWithAppointment();
    res.json({ Busiest_doctor: doctorWithAppointment[0] });
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectDoctorsWithAppointment() {
  try {
    const result = await prisma.doctor.findMany({
      include: {
        appointments: true,
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: {
        appointments: {
          count: "desc",
        },
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
}

async function getDoctorsAppointmentTime(req, res) {}

module.exports = {
  getAllDoctors,
  getOneDoctor,
  postOneDoctor,
  patchOneDoctor,
  deleteOneDoctor,
  getOneDoctorAppointment,
  getOneDoctorPractice,
  getBusyDoctor,
  getDoctorsAppointmentTime,
};
