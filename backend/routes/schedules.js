const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

// const lambda = new AWS.Lambda({ region: "ap-south-east-2" }); d
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.SENDER_USER,
    pass: process.env.SENDER_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.SENDER_USER,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions);
};

router.post("/", async (req, res) => {
  const { employees, datetime, comment } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "fsfkgjskabgibgifgbih", async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const adminId = decoded.id;

    const adminQuery = "SELECT email FROM AdminUsers WHERE id = ?";
    db.query(adminQuery, [adminId], (err, adminResult) => {
      if (err || adminResult.length === 0) {
        return res
          .status(500)
          .json({ message: "Error fetching admin email", error: err });
      }

      const adminEmail = adminResult[0].email;

      const employeeQuery = "SELECT email FROM Employees WHERE id IN (?)";
      db.query(employeeQuery, [employees], (err, employeeResults) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error fetching employee emails", error: err });

        const employeeEmails = employeeResults.map((emp) => emp.email);

        const scheduleQuery =
          "INSERT INTO Schedules (admin_id, schedule_date, comment) VALUES (?, ?, ?)";
        db.query(
          scheduleQuery,
          [adminId, datetime, comment],
          async (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ message: "Error saving schedule", error: err });

            const scheduleId = result.insertId;
            const employeeScheduleQuery =
              "INSERT INTO EmployeeSchedules (schedule_id, employee_id) VALUES ?";
            const employeeScheduleValues = employees.map((employeeId) => [
              scheduleId,
              employeeId,
            ]);

            db.query(
              employeeScheduleQuery,
              [employeeScheduleValues],
              async (err) => {
                if (err)
                  return res.status(500).json({
                    message: "Error saving employee schedules",
                    error: err,
                  });

                const scheduleTime = new Date(datetime);

                const emailTimes = [
                  {
                    time: new Date(scheduleTime - 60 * 60 * 1000),
                    text: "Meeting in 1 hour: " + comment,
                  },
                  {
                    time: new Date(scheduleTime - 30 * 60 * 1000),
                    text: "Meeting in 30 minutes: " + comment,
                  },
                  {
                    time: new Date(scheduleTime - 15 * 60 * 1000),
                    text: "Meeting in 15 minutes: " + comment,
                  },
                ];

                emailTimes.forEach(({ time, text }) => {
                  if (time > new Date()) {
                    schedule.scheduleJob(time, async () => {
                      for (let email of employeeEmails) {
                        await sendEmail(email, "Meeting Reminder", text);
                      }
                    });
                  }
                });

                const lastEmailTime = emailTimes[emailTimes.length - 1].time;
                if (lastEmailTime > new Date()) {
                  schedule.scheduleJob(lastEmailTime, async () => {
                    await sendEmail(
                      adminEmail,
                      "All Emails Sent",
                      "All reminder emails have been sent: " + comment
                    );
                  });
                }

                res
                  .status(201)
                  .json({ message: "Schedule created and reminders set" });
              }
            );
          }
        );
      });
    });
  });
});

module.exports = router;

// Invoke Lambda function
// const params = {
//   FunctionName: "sendMeetingEmail",
//   InvocationType: "Event",
//   Payload: JSON.stringify({
//     employees: employeeEmails,
//     scheduleTime: new Date(datetime).toISOString(),
//     comment,
//     adminEmail,
//   }),
// };

// try {
//   //   await lambda.invoke(params).promise();
//   res
//     .status(201)
//     .json({ message: "Schedule created and reminders sent" });
// } catch (err) {
//   res.status(500).json({
//     message: "Error invoking Lambda function",
//     error: err,
//   });
// }
