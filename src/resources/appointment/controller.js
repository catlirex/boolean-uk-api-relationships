const prisma = require("../../utils/database");

const { errorHandler } = require("../doctor/controller");

async function getAllAppointments(req, res) {
  try {
    const result = await selectAppointments();
    res.json(result);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectAppointments(filterContent, includeContent) {
  try {
    const result = await prisma.appointment.findMany({
      where: filterContent,
      include: includeContent,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function postOneAppointment(req, res) {
  const newAppointment = req.body;
  const validAppointments = newAppointmentChecker(newAppointment);

  if (!validAppointments)
    return res.status(400).json({ ERROR: "Appointment info invalid" });

  try {
    const createdAppointment = await createAppointmentToServer(newAppointment);
    res.json(createdAppointment);
  } catch (e) {
    errorHandler(e, res);
  }
}

function newAppointmentChecker(newAppointment) {
  const newItemRequirements = ["practice_name", "date", "reason", "doctor_id"];
  const { doctor_id, date } = newAppointment;

  const isIdNum = typeof doctor_id === "number";
  const hasAllKeys = newItemRequirements.every((item) =>
    newAppointment.hasOwnProperty(item)
  );

  let lengthMatch = false;
  Object.keys(newAppointment).length === newItemRequirements.length
    ? (lengthMatch = true)
    : (lengthMatch = false);

  if (hasAllKeys && lengthMatch && isIdNum) return true;
  console.log("hasAllKeys", hasAllKeys);
  console.log("lengthMatch", lengthMatch);
  console.log("isIdNum", isIdNum);

  return false;
}

async function createAppointmentToServer(newAppointment) {
  try {
    const result = await prisma.appointment.create({
      data: newAppointment,
    });

    return result;
  } catch (e) {
    throw e;
  }
}

module.exports = { getAllAppointments, postOneAppointment };
