const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = req.db;

  console.log("Received login request:", req.body);
  console.log(`Credentials username: ${username} and password: ${password}`);

  db.query(
    "SELECT * FROM AdminUsers WHERE username = ?",
    [username],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const admin = results[0];
      bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(
            { id: admin.id, email: admin.email },
            "fsfkgjskabgibgifgbih",
            {
              expiresIn: "1h",
            }
          );
          res.json({ token, email: admin.email });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      });
    }
  );
});

module.exports = router;
