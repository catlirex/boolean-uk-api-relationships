const express = require("express");
const { patient } = require("../../utils/database");
const {
  getAllPatients,
  getOnePatient,
  postOnePatient,
  deleteOnePatient,
  patchOnePatient,
  getOnePatientAppointment,
  getPatientRelateDoctors,
} = require("./controller");

const patientRouter = express.Router();

patientRouter.get("/:id/doctors", getPatientRelateDoctors);
patientRouter.get("/:id/appointments", getOnePatientAppointment);
patientRouter.get("/:id", getOnePatient);
patientRouter.get("/", getAllPatients);
patientRouter.post("/", postOnePatient);
patientRouter.delete("/:id", deleteOnePatient);
patientRouter.patch("/:id", patchOnePatient);
module.exports = patientRouter;
