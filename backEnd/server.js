const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shashank",
  database: "university",
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Default route
app.post("/", (req, res) => {
  console.log("Server is running");
  res.json({ message: "Server is running" });
});

//login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the login_detail table for the user_id
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM login_detail WHERE user_id = ?",
        [username],
        (error, results) => {
          if (error) {
            console.error("Database error:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length === 0) {
      // User ID not found
      return res
        .status(401)
        .json({ error: true, message: "User ID not found" });
    }

    // Compare the provided password with the stored password
    const storedPassword = results[0].password;
    if (password === storedPassword) {
      // Passwords match, determine user type and redirect
      const userType = await getUsernameType(username);

      console.log(userType);

      switch (userType) {
        case "faculty":
          return res.json({
            success: true,
            redirect: "../pages/staff/home.html",
          });
        case "student":
          return res.json({
            success: true,
            redirect: "../pages/student/home.html",
          });
        case "admin":
          return res.json({
            success: true,
            redirect: "../pages/admin/home.html",
          });
        default:
          return res
            .status(500)
            .json({ error: true, message: "Invalid user type" });
      }
    } else {
      // Incorrect password
      return res
        .status(401)
        .json({ error: true, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

async function getUsernameType(username) {
  if (username === "admin") {
    return "admin";
  } else {
    const checkFacultySql =
      "SELECT * FROM faculty_details WHERE faculty_id = ?";
    const checkStudentSql =
      "SELECT * FROM student_details WHERE student_id = ?";

    try {
      const [facultyResults] = await db
        .promise()
        .query(checkFacultySql, [username]);
      const [studentResults] = await db
        .promise()
        .query(checkStudentSql, [username]);

      if (facultyResults.length > 0) return "faculty";
      else if (studentResults.length > 0) return "student";
      else return "unknown";
    } catch (error) {
      console.error("Database error in getUsernameType:", error);
      throw error;
    }
  }
}

// Faculty submission endpoint
app.post("/submit-form-faculty", (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO faculty_details SET ?";

  db.query(sql, formData, (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    const loginSql =
      "INSERT INTO login_detail (user_id, password) VALUES (?, ?)";
    const facultyId = formData.faculty_id;
    const password = "112233";

    db.query(loginSql, [facultyId, password], (loginErr, loginResult) => {
      if (loginErr) {
        console.error("Error inserting login data into MySQL");
        res.json({
          error: "Internal Server Error",
          message: {
            code: loginErr.code,
            errno: loginErr.errno,
            sqlMessage: loginErr.sqlMessage,
          },
        });
        return;
      }

      res.json({ message: "Form data received and stored successfully!" });
    });
  });
});

//fetch faculty details
app.get("/fetch-faculty-data", (req, res) => {
  const sql = "SELECT faculty_id,full_name,department FROM faculty_details";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data from MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ facultyData: results });
  });
});

//delete faculty details
app.delete("/delete-faculty/:facultyId", (req, res) => {
  const facultyId = req.params.facultyId;

  const sql = "DELETE FROM faculty_details WHERE faculty_id = ?";
  db.query(sql, [facultyId], (err, facultyResult) => {
    if (err) {
      console.error("Error deleting data from MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const loginSql = "DELETE FROM login_detail WHERE user_id = ?";
    db.query(loginSql, [facultyId], (loginErr, loginResult) => {
      if (loginErr) {
        console.error("Error deleting login data from MySQL:", loginErr);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if any rows were affected in both tables
      if (facultyResult.affectedRows > 0 || loginResult.affectedRows > 0) {
        res.json({
          success: true,
          message: "Faculty data deleted successfully",
        });
      } else {
        res.json({
          success: false,
          message: "Faculty data not found or already deleted",
        });
      }
    });
  });
});

// Department submission endpoint
app.post("/submit-form-dept", (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO department_details SET ?";

  db.query(sql, formData, (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ message: "Department data received and stored successfully!" });
  });
});

// Fetch department details
app.get("/fetch-department-data", (req, res) => {
  const sql = "SELECT * FROM department_details";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data from MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ departmentData: result });
  });
});

//delete department details
app.delete("/delete-department/:deptId", (req, res) => {
  const deptId = req.params.deptId;

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Step 1: Delete subjects related to the department
    const deleteSubjectsSql = "DELETE FROM subject_details WHERE dept_id = ?";
    db.query(deleteSubjectsSql, [deptId], (subjectErr, subjectResult) => {
      if (subjectErr) {
        // Rollback the transaction if an error occurs during subject deletion
        db.rollback(() => {
          console.error("Error deleting subjects:", subjectErr);
          res.status(500).json({ error: "Internal Server Error" });
        });
        return;
      }

      // Step 2: Delete the department
      const deleteDeptSql = "DELETE FROM department_details WHERE dept_id = ?";
      db.query(deleteDeptSql, [deptId], (deptErr, deptResult) => {
        if (deptErr) {
          // Rollback the transaction if an error occurs during department deletion
          db.rollback(() => {
            console.error("Error deleting department:", deptErr);
            res.status(500).json({ error: "Internal Server Error" });
          });
          return;
        }

        // Commit the transaction if both deletions are successful
        db.commit((commitErr) => {
          if (commitErr) {
            // Rollback the transaction if an error occurs during commit
            db.rollback(() => {
              console.error("Error committing transaction:", commitErr);
              res.status(500).json({ error: "Internal Server Error" });
            });
            return;
          }

          res.json({
            success: true,
            message: "Department and related subjects deleted successfully",
          });
        });
      });
    });
  });
});

// Subject submission endpoint
app.post("/submit-form-subject", (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO subject_details SET ?";

  db.query(sql, formData, (err, result) => {
    if (err) {
      console.error("Error inserting subject data into MySQL:", err);
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ message: "Subject data received and stored successfully!" });
  });
});

// Fetch subject details
app.get("/fetch-subject-data", (req, res) => {
  const sql = "SELECT * FROM subject_details";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data from MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ subjectData: result });
  });
});

//delete subject details
app.delete("/delete-subject/:subId", (req, res) => {
  const subId = req.params.subId;

  const sql = "DELETE FROM subject_details WHERE subject_code = ?";
  db.query(sql, [subId], (err, result) => {
    if (err) {
      console.error("Error deleting data from MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if any rows were affected (indicating a successful deletion)
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Subject data deleted successfully" });
    } else {
      res.json({
        success: false,
        message: "Subject data not found or already deleted",
      });
    }
  });
});

// Student submission endpoint
app.post("/submit-form-student", (req, res) => {
  const formData = req.body;
  const sql = "INSERT INTO student_details SET ?";

  db.query(sql, formData, (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    const loginSql =
      "INSERT INTO login_detail (user_id, password) VALUES (?, ?)";
    const facultyId = formData.student_id;
    const password = "112233";

    db.query(loginSql, [facultyId, password], (loginErr, loginResult) => {
      if (loginErr) {
        console.error("Error inserting login data into MySQL");
        res.json({
          error: "Internal Server Error",
          message: {
            code: loginErr.code,
            errno: loginErr.errno,
            sqlMessage: loginErr.sqlMessage,
          },
        });
        return;
      }

      res.json({ message: "Form data received and stored successfully!" });
    });
  });
});

//fetch student details
app.get("/fetch-student-data", (req, res) => {
  const sql =
    "SELECT student_id,full_name,semester,department FROM student_details";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching student data from MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }
    res.json({ studentData: result });
  });
});

//delete student details
app.delete("/delete-student/:studId", (req, res) => {
  const studId = req.params.studId;

  const sql = "DELETE FROM student_details WHERE student_id = ?";
  db.query(sql, [studId], (err, studentResult) => {
    if (err) {
      console.error("Error deleting data from MySQL:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const loginSql = "DELETE FROM login_detail WHERE user_id = ?";
    db.query(loginSql, [studId], (loginErr, loginResult) => {
      if (loginErr) {
        console.error("Error deleting login data from MySQL:", loginErr);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if any rows were affected in both tables
      if (studentResult.affectedRows > 0 || loginResult.affectedRows > 0) {
        res.json({
          success: true,
          message: "Student data deleted successfully",
        });
      } else {
        res.json({
          success: false,
          message: "Student data not found or already deleted",
        });
      }
    });
  });
});

// Fetch total counts endpoint
app.get("/fetch-total-counts", (req, res) => {
  const sqlDept = "SELECT COUNT(*) as totalDepts FROM department_details";
  const sqlFaculty = "SELECT COUNT(*) as totalFaculties FROM faculty_details";
  const sqlStudent = "SELECT COUNT(*) as totalStudents FROM student_details";
  const sqlSubject = "SELECT COUNT(*) as totalSubjects FROM subject_details";

  db.query(sqlDept, (err, deptsResult) => {
    if (err) {
      console.error("Error fetching total depts from MySQL");
      res.json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });
      return;
    }

    db.query(sqlFaculty, (err, facultiesResult) => {
      if (err) {
        console.error("Error fetching total faculties from MySQL");
        res.json({
          error: "Internal Server Error",
          message: {
            code: err.code,
            errno: err.errno,
            sqlMessage: err.sqlMessage,
          },
        });
        return;
      }

      db.query(sqlStudent, (err, studentsResult) => {
        if (err) {
          console.error("Error fetching total students from MySQL");
          res.json({
            error: "Internal Server Error",
            message: {
              code: err.code,
              errno: err.errno,
              sqlMessage: err.sqlMessage,
            },
          });
          return;
        }

        db.query(sqlSubject, (err, subjectsResult) => {
          if (err) {
            console.error("Error fetching total subjects from MySQL");
            res.json({
              error: "Internal Server Error",
              message: {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
              },
            });
            return;
          }

          const totalCounts = {
            totalDepts: deptsResult[0].totalDepts,
            totalFaculties: facultiesResult[0].totalFaculties,
            totalStudents: studentsResult[0].totalStudents,
            totalSubjects: subjectsResult[0].totalSubjects,
          };

          res.json(totalCounts);
        });
      });
    });
  });
});

// Endpoint to fetch subject names based on semester
app.get("/subjects", (req, res) => {
  const { semester, username } = req.query;

  // Step 1: Fetch dept_id from department_details based on the faculty's department
  const getDeptIdQuery =
    "SELECT dept_id FROM department_details WHERE dept_name = (SELECT department FROM faculty_details WHERE faculty_id = ?)";
  db.query(getDeptIdQuery, [username], (error, deptResults) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
      return;
    }

    if (deptResults.length === 0) {
      res
        .status(404)
        .json({ error: true, message: "Department not found for the faculty" });
      return;
    }

    const deptId = deptResults[0].dept_id;

    // Step 2: Fetch subjects based on semester and dept_id
    const getSubjectsQuery =
      "SELECT DISTINCT subject_name FROM subject_details WHERE semester = ? AND dept_id = ?";
    db.query(getSubjectsQuery, [semester, deptId], (error, subjectResults) => {
      if (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
        return;
      }

      // Extract subject names from the query results
      const subjectNames = subjectResults.map((row) => row.subject_name);
      res.json(subjectNames);
    });
  });
});

// Endpoint to fetch student name and id based on semster
app.get("/students", (req, res) => {
  const { semester, username } = req.query;

  // Fetch dept_id from department_details based on the faculty's department
  const getDeptQuery =
    "SELECT department FROM faculty_details WHERE faculty_id = ?";
  db.query(getDeptQuery, [username], (error, deptResults) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
      return;
    }

    if (deptResults.length === 0) {
      res
        .status(404)
        .json({ error: true, message: "Department not found for the faculty" });
      return;
    }

    const deptId = deptResults[0].department;
    // Fetch students based on semester and dept_id
    const getStudentsQuery =
      "SELECT student_id, full_name FROM student_details WHERE semester = ? AND department = ?";
    db.query(getStudentsQuery, [semester, deptId], (err, result) => {
      if (err) {
        console.error("Error fetching students:", err);
        res
          .status(500)
          .json({ error: "An error occurred while fetching students." });
        return;
      }
      res.json(result);
    });
  });
});

// Add this endpoint to handle the insertion into mark_details
app.post("/insertMarks", (req, res) => {
  const marksData = req.body;

  const query =
    "INSERT INTO mark_details (student_id, subject_name, semester, exam, marks) VALUES ?";

  const values = marksData.map((mark) => [
    mark.student_id,
    mark.subject_name,
    mark.semester,
    mark.exam,
    mark.marks,
  ]);

  db.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error inserting marks:", err);
      res.status(500).json({
        error: "Internal Server Error",
        message: {
          code: err.code,
          errno: err.errno,
          sqlMessage: err.sqlMessage,
        },
      });

      return;
    } else {
      console.log("Marks inserted successfully");
      res.json({ success: true });
    }
  });
});

app.get("/fetch-student-marks", (req, res) => {
  const { username } = req.query;

  // Get the department name from the faculty_details table
  const facultyQuery =
    "SELECT department FROM faculty_details WHERE faculty_id = ?";
  db.query(facultyQuery, [username], (facultyErr, facultyResult) => {
    if (facultyErr) {
      console.error("Error fetching department from faculty_details table");
      res.status(500).json({
        error: "Internal Server Error",
        message: {
          code: facultyErr.code,
          errno: facultyErr.errno,
          sqlMessage: facultyErr.sqlMessage,
        },
      });
      return;
    }

    const department = facultyResult[0]?.department;

    if (!department) {
      console.error("Department not found for the given faculty_id");
      res.status(400).json({
        error: "Bad Request",
        message: "Department not found for the given faculty_id",
      });
      return;
    }

    // Fetch student details for the specific department
    const studentQuery =
      "SELECT mark_details.student_id, full_name, mark_details.semester, subject_name, " +
      "MAX(CASE WHEN exam = 'MSE 1' THEN marks END) as MS1, " +
      "MAX(CASE WHEN exam = 'MSE 2' THEN marks END) as MS2, " +
      "MAX(CASE WHEN exam = 'SEM' THEN marks END) as SEM " +
      "FROM mark_details " +
      "INNER JOIN student_details ON mark_details.student_id = student_details.student_id " +
      "WHERE student_details.department = ? " +
      "GROUP BY mark_details.student_id, subject_name, mark_details.semester";

    db.query(studentQuery, [department], (studentErr, studentResult) => {
      if (studentErr) {
        console.error("Error fetching student marks from MySQL");
        res.status(500).json({
          error: "Internal Server Error",
          message: {
            code: studentErr.code,
            errno: studentErr.errno,
            sqlMessage: studentErr.sqlMessage,
          },
        });
        return;
      }

      res.json({ studentMarks: studentResult });
    });
  });
});

app.post("/update-mark", (req, res) => {
  const updateData = req.body;

  // Update MSE1
  updateMarks("MSE 1", updateData.MSE1, updateData);
  // Update MSE2
  updateMarks("MSE 2", updateData.MSE2, updateData);
  // Update SEM
  updateMarks("SEM", updateData.SEM, updateData);

  res.json({ success: true, message: "Marks updated successfully!" });
});

function updateMarks(exam, marks, data) {
  const selectSql = `
    SELECT *
    FROM mark_details
    WHERE student_id = ? AND subject_name = ? AND semester = ? AND exam = ?`;

  const updateSql = `
    UPDATE mark_details
    SET marks = ?
    WHERE student_id = ? AND subject_name = ? AND semester = ? AND exam = ?`;

  const insertSql = `
    INSERT INTO mark_details (student_id, subject_name, semester, exam, marks)
    VALUES (?, ?, ?, ?, ?)`;

  // Check if the row exists
  db.query(
    selectSql,
    [data.student_id, data.subjectName, data.semester, exam],
    (err, result) => {
      if (err) {
        console.error(`Error checking if ${exam} row exists:`, err);
        // Handle the error accordingly
      } else {
        if (result.length > 0) {
          // Row exists, update the marks
          db.query(
            updateSql,
            [marks, data.student_id, data.subjectName, data.semester, exam],
            (err, result) => {
              if (err) {
                console.error(`Error updating ${exam} marks:`, err);
                // Handle the error accordingly
              } else {
                console.log(`${exam} Marks updated successfully`);
              }
            }
          );
        } else {
          // Row doesn't exist, insert new row
          db.query(
            insertSql,
            [data.student_id, data.subjectName, data.semester, exam, marks],
            (err, result) => {
              if (err) {
                console.error(`Error inserting ${exam} marks:`, err);
                // Handle the error accordingly
              } else {
                console.log(`${exam} Marks inserted successfully`);
              }
            }
          );
        }
      }
    }
  );
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
