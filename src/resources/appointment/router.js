const express = require("express");

const { getAllAppointments, postOneAppointment } = require("./controller");

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAllAppointments);
appointmentRouter.post("/", postOneAppointment);

module.exports = appointmentRouter;
