const express = require("express");

const {
  getAllAppointments,
  postOneAppointment,
  patchOneAppointment,
  deleteOneAppointment,
  getOneAppointment,
} = require("./controller");

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAllAppointments);
appointmentRouter.post("/", postOneAppointment);
appointmentRouter.patch("/:id", patchOneAppointment);
appointmentRouter.delete("/:id", deleteOneAppointment);
appointmentRouter.get("/:id", getOneAppointment);

module.exports = appointmentRouter;
