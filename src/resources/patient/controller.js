const prisma = require("../../utils/database");

const { errorHandler } = require("../doctor/controller");

async function getAllPatients(req, res) {
  try {
    const result = await selectPatients();
    res.json(result);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectPatients(filterContent, orderContent) {
  try {
    const result = await prisma.patient.findMany({
      where: filterContent,
      orderBy: orderContent,
      include: { appointments: true },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function getOnePatient(req, res) {
  const id = Number(req.params.id);
  try {
    const result = await selectOnePatient({ id });
    if (result) res.json(result);
    else res.json({ msg: "Item not found" });
  } catch (e) {
    errorHandler(e, res);
  }
}

async function selectOnePatient(filterContent, includeContent) {
  try {
    const result = await prisma.patient.findUnique({
      where: filterContent,
      include: includeContent,
    });
    return result;
  } catch (e) {
    throw e;
  }
}

async function postOnePatient(req, res) {
  const newPatient = req.body;
  const { appointments } = newPatient;
  const validPatient = newPatientChecker(newPatient);

  if (!validPatient)
    return res.status(400).json({ ERROR: "Patient info invalid" });

  if (appointments) {
    const validAppointments = newPatientAppointmentChecker(appointments);
    if (!validAppointments)
      return res.status(400).json({ ERROR: "Doctor info invalid" });
  }

  try {
    const createdPatient = await createPatientToServer(newPatient);
    res.json(createdPatient);
  } catch (e) {
    errorHandler(e, res);
  }
}

function newPatientChecker(newPatient) {
  const newItemRequirements = ["first_name", "last_name", "birthday"];
  let lengthMatch = false;

  const hasAllKeys = newItemRequirements.every((item) =>
    newPatient.hasOwnProperty(item)
  );

  if (newPatient.appointments)
    Object.keys(newPatient).length === newItemRequirements.length + 1
      ? (lengthMatch = true)
      : (lengthMatch = false);

  if (!newPatient.appointments)
    Object.keys(newPatient).length === newItemRequirements.length
      ? (lengthMatch = true)
      : (lengthMatch = false);

  if (hasAllKeys && lengthMatch) return true;
  else return false;
}

function newPatientAppointmentChecker(appointments) {
  const newItemRequirements = ["practice_name", "date", "reason", "doctor_id"];
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
    if (!isValid) break;
  }
  return isValid;
}

async function createPatientToServer(newPatient) {
  const { first_name, last_name, birthday, appointments } = newPatient;
  try {
    const result = await prisma.patient.create({
      data: {
        first_name,
        last_name,
        birthday,
        appointments: { create: appointments },
      },
      include: { appointments: true },
    });

    return result;
  } catch (e) {
    throw e;
  }
}

async function deleteOnePatient(req, res) {
  const id = Number(req.params.id);
  try {
    const deletedPatient = await prisma.patient.delete({
      where: { id },
      include: { appointments: true },
    });

    res.json(deletedPatient);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function patchOnePatient(req, res) {
  const id = Number(req.params.id);
  const toUpdateContent = req.body;

  try {
    const itemExist = await itemChecker(id);
    if (!itemExist)
      return res.status(400).json({ ERROR: `PATIENT NOT FOUND id:${id}` });

    const contentValid = updatePatientChecker(toUpdateContent);
    if (!contentValid)
      return res.status(400).json({ ERROR: `Update info incorrect` });

    const updatedPatient = await updatePatientToServer(id, toUpdateContent);
    res.json(updatedPatient);
  } catch (e) {
    errorHandler(e, res);
  }
}

async function itemChecker(id) {
  try {
    const toUpdateItem = await prisma.patient.findUnique({
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

function updatePatientChecker(toUpdateObject) {
  const updateItemRequirements = ["first_name", "last_name", "birthday"];

  for (const key of Object.keys(toUpdateObject)) {
    const keyChecker = updateItemRequirements.includes(key);
    if (!keyChecker) return false;
  }

  return true;
}

async function updatePatientToServer(id, toUpdateContent) {
  try {
    const updatedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: toUpdateContent,
    });

    return updatedPatient;
  } catch (e) {
    throw e;
  }
}

async function getOnePatientAppointment(req, res) {
  const id = Number(req.params.id);

  try {
    const result = await selectOnePatient({ id }, { appointments: true });

    if (result.appointments) res.json({ appointments: result.appointments });
    if (!result.appointments) res.json({ msg: "No item found" });
  } catch (e) {
    errorHandler(e, res);
  }
}

async function getPatientRelateDoctors(req, res) {
  const id = Number(req.params.id);
  const { filterPractice } = req.query;
  const includeContent = {
    appointments: {
      where: { practice_name: filterPractice },
      include: { doctor: true },
    },
  };

  const result = await selectOnePatient({ id }, includeContent);

  if (!result) return res.status(400).json({ ERROR: "No Patient Found" });
  const doctorList = generateDoctorList(result.appointments);
  res.json(doctorList);
}

function generateDoctorList(appointmentList) {
  if (!appointmentList.length) return { msg: "No Doctor for this patient" };
  if (appointmentList.length) {
    const doctorList = [];
    for (const appointments of appointmentList) {
      doctorList.push(appointments.doctor);
    }
    return doctorList;
  }
}

module.exports = {
  getAllPatients,
  getOnePatient,
  postOnePatient,
  deleteOnePatient,
  patchOnePatient,
  getOnePatientAppointment,
  getPatientRelateDoctors,
};
