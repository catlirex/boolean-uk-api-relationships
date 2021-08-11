const express = require("express");

const {
  getAllDoctors,
  getOneDoctor,
  postOneDoctor,
  patchOneDoctor,
  deleteOneDoctor,
  getOneDoctorAppointment,
  getOneDoctorPractice,
  getBusyDoctor,
  getDoctorsAppointmentTime,
} = require("./controller");

const doctorRouter = express.Router();

doctorRouter.post("/", postOneDoctor);
doctorRouter.patch("/:id", patchOneDoctor);
doctorRouter.delete("/:id", deleteOneDoctor);
doctorRouter.get("/most-busy", getBusyDoctor);
doctorRouter.get("/total-hours", getDoctorsAppointmentTime);
doctorRouter.get("/:id", getOneDoctor);
doctorRouter.get("/:id/appointments", getOneDoctorAppointment);
doctorRouter.get("/:id/practice", getOneDoctorPractice);
doctorRouter.get("/", getAllDoctors);

module.exports = doctorRouter;
