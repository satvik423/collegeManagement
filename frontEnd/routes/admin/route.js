// fetch Department Data
const departmentTable = document.getElementById("departmentTable");
if (departmentTable) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/fetch-department-data")
      .then((response) => response.json())
      .then((data) => {
        if (data.departmentData) {
          renderDepartmentTable(data.departmentData);
        } else {
          console.error("Error fetching department data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    function renderDepartmentTable(departmentData) {
      const tableBody = document.createElement("tbody");

      departmentData.forEach((department) => {
        const row = document.createElement("tr");

        Object.values(department).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          row.appendChild(td);
        });
        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        deleteButton.addEventListener("click", function () {
          const deptId = department.dept_id;
          deleteRow(row, deptId);
        });

        const deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        tableBody.appendChild(row);
      });
      departmentTable.appendChild(tableBody);
    }
    function deleteRow(row, deptId) {
      const rowIndex = row.rowIndex;

      fetch(`http://localhost:3000/delete-department/${deptId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          // Remove the row from the table only if the server-side deletion is successful
          if (data.success) {
            departmentTable.deleteRow(rowIndex);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
}

// fetching and displaying faculty details
const facultyTable = document.getElementById("facultyTable");
if (facultyTable) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/fetch-faculty-data")
      .then((response) => response.json())
      .then((data) => {
        if (data.facultyData) {
          renderfacultyTable(data.facultyData);
        } else {
          console.error("Error fetching faculty data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    function renderfacultyTable(facultyData) {
      const tableBody = document.createElement("tbody");

      facultyData.forEach((faculty) => {
        const row = document.createElement("tr");

        Object.values(faculty).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          row.appendChild(td);
        });

        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        deleteButton.addEventListener("click", function () {
          const facultyId = faculty.faculty_id;
          deleteRow(row, facultyId);
        });

        const deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
      });
      facultyTable.appendChild(tableBody);
    }

    function deleteRow(row, facultyId) {
      const rowIndex = row.rowIndex;

      fetch(`http://localhost:3000/delete-faculty/${facultyId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          // Remove the row from the table only if the server-side deletion is successful
          if (data.success) {
            facultyTable.deleteRow(rowIndex);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
}

// fetch subject data
const subjectTable = document.getElementById("subjectTable");
if (subjectTable) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/fetch-subject-data")
      .then((response) => response.json())
      .then((data) => {
        if (data.subjectData) {
          renderSubjectTable(data.subjectData);
        } else {
          console.error("Error fetching department data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    function renderSubjectTable(subjectData) {
      const tableBody = document.createElement("tbody");

      subjectData.forEach((subject) => {
        const row = document.createElement("tr");

        Object.values(subject).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          row.appendChild(td);
        });
        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        deleteButton.addEventListener("click", function () {
          const subId = subject.subject_code;
          deleteRow(row, subId);
        });

        const deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        tableBody.appendChild(row);
      });
      subjectTable.appendChild(tableBody);
    }
    function deleteRow(row, subId) {
      const rowIndex = row.rowIndex;

      fetch(`http://localhost:3000/delete-subject/${subId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          // Remove the row from the table only if the server-side deletion is successful
          if (data.success) {
            subjectTable.deleteRow(rowIndex);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
}

//fetch student details
const studentTable = document.getElementById("studentTable");
if (studentTable) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/fetch-student-data")
      .then((response) => response.json())
      .then((data) => {
        if (data.studentData) {
          renderStudentTable(data.studentData);
        } else {
          console.error("Error fetching student data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    function renderStudentTable(studentData) {
      const tableBody = document.createElement("tbody");

      studentData.forEach((student) => {
        const row = document.createElement("tr");

        Object.values(student).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          row.appendChild(td);
        });

        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "Delete";
        deleteButton.addEventListener("click", function () {
          const studentId = student.student_id;
          deleteRow(row, studentId);
        });

        const deleteCell = document.createElement("td");
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
      });
      studentTable.appendChild(tableBody);
    }

    function deleteRow(row, studentId) {
      const rowIndex = row.rowIndex;

      fetch(`http://localhost:3000/delete-student/${studentId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          // Remove the row from the table only if the server-side deletion is successful
          if (data.success) {
            studentTable.deleteRow(rowIndex);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
}

//  submition of department details
const deptForm = document.getElementById("deptForm");
if (deptForm) {
  document.addEventListener("DOMContentLoaded", function () {
    const messageElement = document.getElementById("message");

    deptForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const form = event.target;
      const formData = {
        dept_name: form.querySelector(".deptName").value,
        dept_id: form.querySelector(".dept_id").value,
      };

      fetch("http://localhost:3000/submit-form-dept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          if (data.error) {
            // Display error message
            if (data.message.code === "ER_DUP_ENTRY") {
              messageElement.textContent = `Department ID ${formData.dept_id} already exists.`;
            } else {
              messageElement.textContent =
                "Error submitting form data. Please try again.";
            }
          } else {
            // Display success message and clear the form
            messageElement.textContent = "Form data submitted successfully!";
            form.reset();
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
  });
} else {
  document.addEventListener("DOMContentLoaded", function () {
    const departmentDatalist = document.getElementById("dept");
    const subjectForm = document.getElementById("subjectForm");
    const facultyForm = document.getElementById("facultyForm");
    const studentForm = document.getElementById("studentForm");
    const messageElement = document.getElementById("message");

    if (subjectForm || facultyForm || studentForm) {
      fetch("http://localhost:3000/fetch-department-data")
        .then((response) => response.json())
        .then((data) => {
          if (data.departmentData && data.departmentData.length > 0) {
            data.departmentData.forEach((department) => {
              const option = document.createElement("option");
              option.value = department.dept_name;
              option.setAttribute("data-dept-id", department.dept_id);
              departmentDatalist.appendChild(option);
            });
          } else {
            disableFormSubmission(subjectForm);
            disableFormSubmission(facultyForm);
            disableFormSubmission(studentForm);
            messageElement.textContent =
              "No departments available. Please create a new department.";
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
    function disableFormSubmission(form) {
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          messageElement.textContent =
            "Cannot submit form. No departments available. Please create a new department.";
        });

        const submitButton = form.querySelector(".btn-next");
        if (submitButton) {
          submitButton.disabled = true;
        }
      }
    }

    // submition of faculty details
    // const facultyForm = document.getElementById("facultyForm");
    if (facultyForm) {
      facultyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const messageElement = document.getElementById("message");
        const form = event.target;
        const formData = {
          full_name: form.querySelector(".fullName").value,
          gender: form.querySelector(".gender").value,
          post: form.querySelector(".post").value,
          contact_number: form.querySelector(".contactNumber").value,
          email: form.querySelector(".email").value,
          department: form.querySelector(".dept").value,
          faculty_id: form.querySelector(".faculty_id").value,
        };

        fetch("http://localhost:3000/submit-form-faculty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Server response:", data);
            if (data.error) {
              // Display error message
              if (data.message.code === "ER_DUP_ENTRY") {
                messageElement.textContent = `Faculty ID ${formData.faculty_id} already exists.`;
              } else {
                messageElement.textContent =
                  "Error submitting form data. Please try again.";
              }
            } else {
              // Display success message and clear the form
              messageElement.textContent = "Form data submitted successfully!";
              form.reset();
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      });
    }

    // submition of subject details
    // const subjectForm = document.getElementById("subjectForm");
    if (subjectForm) {
      subjectForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const form = event.target;
        const selectedOption = form.querySelector(".dept").value;
        const selectedOptionElement = form.querySelector(
          `datalist#dept option[value="${selectedOption}"]`
        );
        const formData = {
          subject_code: form.querySelector(".sub_id").value,
          subject_name: form.querySelector(".subName").value,
          semester: form.querySelector(".sem").value,
          dept_id: selectedOptionElement
            ? selectedOptionElement.getAttribute("data-dept-id")
            : null,
        };
        console.log(formData);
        fetch("http://localhost:3000/submit-form-subject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Server response:", data);
            if (data.error) {
              // Display error message
              if (data.message.code === "ER_DUP_ENTRY") {
                messageElement.textContent = `Subject ID ${formData.subject_code} already exists.`;
              } else {
                messageElement.textContent =
                  "Error submitting form data. Please try again.";
              }
            } else {
              // Display success message and clear the form
              messageElement.textContent = "Form data submitted successfully!";
              form.reset();
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      });
    }

    //submition of student details
    // const studentForm = document.getElementById("studentForm");
    if (studentForm) {
      studentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const messageElement = document.getElementById("message");
        const form = event.target;
        const formData = {
          student_id: form.querySelector(".student_id").value,
          full_name: form.querySelector(".fullName").value,
          gender: form.querySelector(".gender").value,
          contact_number: form.querySelector(".contactNumber").value,
          email: form.querySelector(".email").value,
          department: form.querySelector(".dept").value,
          semester: form.querySelector(".sem").value,
        };

        fetch("http://localhost:3000/submit-form-student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Server response:", data);
            if (data.error) {
              // Display error message
              if (data.message.code === "ER_DUP_ENTRY") {
                messageElement.textContent = `Student ID ${formData.student_id} already exists.`;
              } else {
                messageElement.textContent =
                  "Error submitting form data. Please try again.";
              }
            } else {
              // Display success message and clear the form
              messageElement.textContent = "Form data submitted successfully!";
              form.reset();
            }
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      });
    }
  });
}
