const express = require("express");
const {
  getAllPatients,
  getOnePatient,
  postOnePatient,
  deleteOnePatient,
  patchOnePatient,
} = require("./controller");

const patientRouter = express.Router();

patientRouter.get("/:id", getOnePatient);
patientRouter.get("/", getAllPatients);
patientRouter.post("/", postOnePatient);
patientRouter.delete("/:id", deleteOnePatient);
patientRouter.patch("/:id", patchOnePatient);

module.exports = patientRouter;
