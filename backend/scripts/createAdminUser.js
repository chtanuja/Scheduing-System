const bcrypt = require("bcryptjs");
const db = require("../db");

const username = "admin1";
const password = "admin@1";
const email = "tanujach1144@gmail.com";

const checkUserQuery = "SELECT * FROM AdminUsers WHERE username = ?";
db.query(checkUserQuery, [username], (err, results) => {
  if (err) {
    console.error("Error checking for existing user:", err);
    process.exit(1);
  }

  if (results.length > 0) {
    console.log("User already exists.");
    process.exit(0);
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing the password:", err);
        process.exit(1);
      }

      const insertUserQuery =
        "INSERT INTO AdminUsers (username, password, email) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [username, hash, email], (err, results) => {
        if (err) {
          console.error("Error inserting the admin user:", err);
          process.exit(1);
        }
        console.log("Admin user created successfully:", results);
        process.exit(0);
      });
    });
  }
});
