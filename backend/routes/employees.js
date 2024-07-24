const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "fsfkgjskabgibgifgbih", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.get("/", authenticateJWT, (req, res) => {
  const adminId = req.user.id;

  db.query(
    "SELECT * FROM Employees WHERE admin_id = ?",
    [adminId],
    (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
