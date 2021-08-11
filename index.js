const exp = require("constants");
const express = require("express");
const morgan = require("morgan");

const doctorRouter = require("./src/resources/doctor/router");
const appointmentRouter = require("./src/resources/appointment/router");
const patientRouter = require("./src/resources/patient/router");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/doctors", doctorRouter);
app.use("/appointments", appointmentRouter);
app.use("/patients", patientRouter);

app.all("*", (req, res) => {
  res.json({ ok: "true" });
});

const port = 3030;
app.listen(port, () => {
  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
