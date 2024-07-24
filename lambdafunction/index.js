const AWS = require("aws-sdk");

const ses = new AWS.SES({ region: "ap-southeast-2" }); // Adjust region if needed

export const handler = async (event) => {
  try {
    const { employees, scheduleTime, comment, adminEmail } = JSON.parse(
      event.body
    );

    // Define email times
    const emailTimes = [
      new Date(scheduleTime - 60 * 60 * 1000), // 1 hour before
      new Date(scheduleTime - 30 * 60 * 1000), // 30 minutes before
      new Date(scheduleTime - 15 * 60 * 1000), // 15 minutes before
    ];

    const sendEmail = async (to, subject, text) => {
      const params = {
        Destination: { ToAddresses: [to] },
        Message: {
          Body: { Text: { Data: text } },
          Subject: { Data: subject },
        },
        Source: "tanujachintalapati1144@gmail.com", // Replace with your verified SES email
      };
      return ses.sendEmail(params).promise();
    };

    const sendReminderEmails = async () => {
      const now = new Date();
      for (let time of emailTimes) {
        if (time > now) {
          const delay = time - now;
          setTimeout(async () => {
            for (let employee of employees) {
              await sendEmail(employee, "Meeting Reminder", comment);
            }
          }, delay);
        }
      }
    };

    // Send reminder emails
    await sendReminderEmails();

    // Notify admin after all emails are sent
    const adminNotificationTime = new Date(scheduleTime + 10 * 60 * 1000); // Adjust as needed
    setTimeout(async () => {
      await sendEmail(
        adminEmail,
        "All Emails Sent",
        "All reminder emails have been sent."
      );
    }, adminNotificationTime - new Date());

    return {
      statusCode: 200,
      body: JSON.stringify("Emails scheduled successfully"),
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error sending emails"),
    };
  }
};
