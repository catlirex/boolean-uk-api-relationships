const { appointment } = require("../../utils/database");
const prisma = require("../../utils/database");

const {
  errorHandler,
  selectDoctorsWithAppointment,
} = require("../doctor/controller");

async function getAllAppointments(req, res) {
  const { filter, value, order } = req.query;
  let orderContent = null;
  const filterContent = {
    [filter]: value,
  };
  if (order === "recent") orderContent = { date: "asc" };

  console.log(filterContent);

  try {
    const result = await selectAppointments(filterContent, orderContent);
    res.json(result);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectAppointments(filterContent, orderContent) {
  try {
    const result = await prisma.appointment.findMany({
      where: filterContent,
      orderBy: orderContent,
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

async function patchOneAppointment(req, res) {
  const id = Number(req.params.id);
  const toUpdateContent = req.body;
  try {
    const itemExist = await itemChecker(id);
    if (!itemExist)
      return res.status(400).json({ ERROR: `APPOINTMENT NOT FOUND id:${id}` });

    const contentValid = updateAppointmentChecker(toUpdateContent);
    if (!contentValid)
      return res.status(400).json({ ERROR: `Update info incorrect` });

    const updatedAppointment = await updateAppointmentToServer(
      id,
      toUpdateContent
    );

    res.json(updatedAppointment);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function itemChecker(id) {
  try {
    const toUpdateItem = await prisma.appointment.findUnique({
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

function updateAppointmentChecker(toUpdateContent) {
  const updateItemRequirements = [
    "practice_name",
    "date",
    "reason",
    "doctor_id",
  ];

  for (const key of Object.keys(toUpdateContent)) {
    const keyChecker = updateItemRequirements.includes(key);
    if (!keyChecker) return false;
  }

  return true;
}

async function updateAppointmentToServer(id, toUpdateContent) {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: toUpdateContent,
    });

    return updatedAppointment;
  } catch (e) {
    throw e;
  }
}

async function deleteOneAppointment(req, res) {
  const id = Number(req.params.id);
  try {
    const deletedAppointment = await prisma.appointment.delete({
      where: { id },
    });

    res.json(deletedAppointment);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function getOneAppointment(req, res) {
  const id = Number(req.params.id);

  try {
    const result = await prisma.appointment.findUnique({
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

async function getDoctorWithAppointment(req, res) {
  try {
    const doctorsIncludeAppointment = await selectDoctorsWithAppointment();

    const result = doctorsIncludeAppointment.filter(
      (target) => target["_count"].appointments !== 0
    );
    res.json(result);
  } catch (e) {
    errorHandler(e, res);
  }
}

module.exports = {
  getAllAppointments,
  postOneAppointment,
  patchOneAppointment,
  deleteOneAppointment,
  getOneAppointment,
  getDoctorWithAppointment,
};
