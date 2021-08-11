const express = require("express");

const {
  getAllAppointments,
  postOneAppointment,
  patchOneAppointment,
  deleteOneAppointment,
  getOneAppointment,
  getDoctorWithAppointment,
} = require("./controller");

const appointmentRouter = express.Router();

appointmentRouter.get("/doctors", getDoctorWithAppointment);
appointmentRouter.post("/", postOneAppointment);
appointmentRouter.patch("/:id", patchOneAppointment);
appointmentRouter.delete("/:id", deleteOneAppointment);
appointmentRouter.get("/:id", getOneAppointment);
appointmentRouter.get("/", getAllAppointments);

module.exports = appointmentRouter;
