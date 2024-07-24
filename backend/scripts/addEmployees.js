const db = require("../db");

const employees = [
  { name: "Anand Sharma", email: "samplemailno01@gmail.com", adminId: 4 },
  { name: "Priya Datla", email: "samplemailno02@gmail.com", adminId: 4 },
  { name: "Surya Varma", email: "samplemailno03@gmail.com", adminId: 4 },
];

const addEmployees = () => {
  employees.forEach((employee) => {
    const query =
      "INSERT INTO Employees (name, email, admin_id) VALUES (?, ?, ?)";
    db.query(
      query,
      [employee.name, employee.email, employee.adminId],
      (err, results) => {
        if (err) {
          console.error("Error adding employee:", err);
        } else {
          console.log("Employee added successfully:", results.insertId);
        }
      }
    );
  });
};

addEmployees();
