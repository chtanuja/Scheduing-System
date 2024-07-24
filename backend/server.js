const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const db = require("./db");

dotenv.config();

const authRouter = require("./routes/auth");
const employeeRouter = require("./routes/employees");
const scheduleRouter = require("./routes/schedules");

const app = express();
const port = process.env.PORT || 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/schedules", scheduleRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ message: "An error occurred", error: err });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
