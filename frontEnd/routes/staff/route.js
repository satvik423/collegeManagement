// Retrieve the username from sessionStorage
const storedUsername = sessionStorage.getItem("username");

const marksTable = document.getElementById("markTable");
if (marksTable) {
  // Get references to the form elements
  const semInput = document.querySelector(".sem");
  const subInput = document.querySelector(".sub");
  const subDrop = document.getElementById("sub");
  const searchBtn = document.querySelector(".btn-search");
  const addBtn = document.querySelector(".btn-add");

  // Add event listeners to handle form interactions
  semInput.addEventListener("input", handleSemInput);
  subInput.addEventListener("input", handleSubInput);
  searchBtn.addEventListener("click", handleSearch);

  // Function to handle changes in semester input
  async function handleSemInput() {
    // Disable the subject input initially
    subInput.setAttribute("disabled", true);
    // Disable search and add buttons until both semester and subject are filled
    searchBtn.setAttribute("disabled", true);
    addBtn.setAttribute("disabled", true);

    // Fetch subject names based on the selected semester
    const selectedSemester = semInput.value;
    try {
      const storedUsername = sessionStorage.getItem("username");

      const response = await fetch(
        `http://localhost:3000/subjects?semester=${selectedSemester}&username=${encodeURIComponent(
          storedUsername
        )}`
      );
      const subjectData = await response.json();
      // Populate the subject datalist with subject names
      populateSubjectDatalist(subjectData);

      // Enable the subject input
      subInput.removeAttribute("disabled");
    } catch (error) {
      console.error("Error fetching subject data:", error);
    }
  }

  // Function to populate the subject datalist with subject names
  function populateSubjectDatalist(subjectData) {
    // Clear existing options in the subject datalist
    subDrop.innerHTML = "";

    // Add new options based on the fetched subject data
    subjectData.forEach((subject) => {
      try {
        const option = document.createElement("option");
        option.value = subject;
        subDrop.appendChild(option);
      } catch (error) {
        console.error("Error creating option:", error);
      }
    });
  }

  // Function to handle changes in subject input
  function handleSubInput() {
    // Enable search button when both semester and subject are filled
    if (semInput.value && subInput.value) {
      searchBtn.removeAttribute("disabled");
    } else {
      searchBtn.setAttribute("disabled", true);
    }
  }

  // Function to handle search button click
  async function handleSearch(event) {
    event.preventDefault();

    const selectedSemester = semInput.value;

    try {
      const storedUsername = sessionStorage.getItem("username");

      const response = await fetch(
        `http://localhost:3000/students?semester=${selectedSemester}&username=${encodeURIComponent(
          storedUsername
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const studentData = await response.json();

      // Clear previous entries
      marksTable.innerHTML = "";

      // Populate the studentTable with student names and input boxes for marks
      renderStudentTable(studentData);

      // Enable the add button once the table is populated
      addBtn.removeAttribute("disabled");
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }

  function renderStudentTable(studentData) {
    const tableHeader = document.createElement("thead");
    const row = document.createElement("tr");
    const tdUsn = document.createElement("th");
    tdUsn.textContent = "USN";
    row.appendChild(tdUsn);

    const tdName = document.createElement("th");
    tdName.textContent = "Student Name";
    row.appendChild(tdName);

    const tdMarks = document.createElement("th");
    tdMarks.textContent = "Marks";
    row.appendChild(tdMarks);

    tableHeader.appendChild(row);
    marksTable.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    studentData.forEach((student) => {
      const row = document.createElement("tr");

      const tdUsn = document.createElement("td");
      tdUsn.textContent = student.student_id;
      row.appendChild(tdUsn);

      const tdName = document.createElement("td");
      tdName.textContent = student.full_name;
      row.appendChild(tdName);

      const tdMarks = document.createElement("td");
      const inputMarks = document.createElement("input");
      inputMarks.type = "text";
      inputMarks.className = "marks-input";
      inputMarks.name = student.student_id;
      tdMarks.appendChild(inputMarks);
      inputMarks.required = true;
      row.appendChild(tdMarks);
      tableBody.appendChild(row);
    });

    marksTable.appendChild(tableBody);
  }

  const deptForm = document.getElementById("deptForm");
  if (deptForm) {
    document.addEventListener("DOMContentLoaded", function () {
      const messageElement = document.getElementById("message");

      deptForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const exam = deptForm.querySelector(".exam").value;
        const sem = deptForm.querySelector(".sem").value;
        const sub = deptForm.querySelector(".sub").value;

        const marksInputs = deptForm.querySelectorAll(".marks-input");
        const marksData = Array.from(marksInputs).map((input) => {
          return {
            student_id: input.name,
            subject_name: sub,
            semester: sem,
            exam: exam,
            marks: parseInt(input.value),
          };
        });

        submitMarksToAPI(marksData);
      });

      // Function to make API requests to submit marks
      // Function to make API requests to submit marks
      async function submitMarksToAPI(data) {
        try {
          const response = await fetch("http://localhost:3000/insertMarks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response}`);
          }

          const result = await response.json();
          console.log(result.message);
          messageElement.textContent = "Marks added successfully!";
          // Clear previous entries
          marksTable.innerHTML = "";
          const tableHeader = document.createElement("thead");
          const row = document.createElement("tr");
          const tdUsn = document.createElement("th");
          tdUsn.textContent = "USN";
          row.appendChild(tdUsn);

          const tdName = document.createElement("th");
          tdName.textContent = "Student Name";
          row.appendChild(tdName);

          const tdMarks = document.createElement("th");
          tdMarks.textContent = "Marks";
          row.appendChild(tdMarks);

          tableHeader.appendChild(row);
          marksTable.appendChild(tableHeader);
        } catch (error) {
          console.error("Error submitting marks:", error);
          messageElement.textContent = "Error adding marks. Please try again.";
        }
      }
    });
  }
}

const studentTable = document.getElementById("studentTable");
if (studentTable) {
  document.addEventListener("DOMContentLoaded", function () {
    if (studentTable) {
      const storedUsername = sessionStorage.getItem("username");
      fetch(
        `http://localhost:3000/fetch-student-marks?username=${encodeURIComponent(
          storedUsername
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.studentMarks) {
            renderStudentTable(data.studentMarks);
          } else {
            console.error("Error fetching student marks:", data.error);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });

      function renderStudentTable(studentMarks) {
        const tableBody = document.createElement("tbody");

        studentMarks.forEach((student) => {
          const row = document.createElement("tr");

          const tdStudentId = document.createElement("td");
          tdStudentId.textContent = student.student_id;
          row.appendChild(tdStudentId);

          const tdStudentName = document.createElement("td");
          tdStudentName.textContent = student.full_name;
          row.appendChild(tdStudentName);

          const tdSemester = document.createElement("td");
          tdSemester.textContent = student.semester;
          tdSemester.classList.add("sem_name");
          tdSemester.value = student.semester;
          row.appendChild(tdSemester);

          const tdSubject = document.createElement("td");
          tdSubject.textContent = student.subject_name;
          tdSubject.classList.add("sub_name");
          tdSubject.value = student.subject_name;
          row.appendChild(tdSubject);

          const tdMS1 = document.createElement("td");
          const inputMS1 = document.createElement("input");
          inputMS1.type = "text";
          inputMS1.value = student.MS1 || "-";
          inputMS1.classList.add("marksInput");
          inputMS1.classList.add("MSE1");
          inputMS1.disabled = true;
          tdMS1.appendChild(inputMS1);
          row.appendChild(tdMS1);

          const tdMS2 = document.createElement("td");
          const inputMS2 = document.createElement("input");
          inputMS2.type = "text";
          inputMS2.value = student.MS2 || "-";
          inputMS2.classList.add("marksInput");
          inputMS2.classList.add("MSE2");
          inputMS2.disabled = true;
          tdMS2.appendChild(inputMS2);
          row.appendChild(tdMS2);

          const tdSEM = document.createElement("td");
          const inputSEM = document.createElement("input");
          inputSEM.type = "text";
          inputSEM.value = student.SEM || "-";
          inputSEM.classList.add("marksInput");
          inputSEM.classList.add("SEM");
          inputSEM.disabled = true;
          tdSEM.appendChild(inputSEM);
          row.appendChild(tdSEM);

          // Edit Button
          const tdEdit = document.createElement("td");
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("editButton");
          editButton.name = student.student_id; // Set student_id as the name attribute
          editButton.addEventListener("click", function () {
            enableEdit(row);
          });
          tdEdit.appendChild(editButton);
          row.appendChild(tdEdit);

          tableBody.appendChild(row);
        });

        studentTable.appendChild(tableBody);
      }
      function enableEdit(row) {
        const marksInputs = row.querySelectorAll(".marksInput");
        const editButton = row.querySelector(".editButton");

        marksInputs.forEach((input) => {
          input.disabled = false;
        });

        // Change the button to "Update"
        editButton.textContent = "Update";
        editButton.removeEventListener("click", enableEdit);
        editButton.addEventListener("click", function () {
          updateMarks(row);
        });
      }
      async function updateMarks(row) {
        const studentId = row.querySelector(".editButton").name;
        const subjectName = row.querySelector(".sub_name").value;
        const semester = row.querySelector(".sem_name").value;
        const mse1 = parseInt(row.querySelector(".MSE1").value) || null;
        const mse2 = parseInt(row.querySelector(".MSE2").value) || null;
        const sem = parseInt(row.querySelector(".SEM").value) || null;

        const updateData = {
          student_id: studentId,
          subjectName: subjectName,
          semester: semester,
          MSE1: mse1,
          MSE2: mse2,
          SEM: sem,
        };
        console.log(updateData);
        try {
          const response = await fetch("http://localhost:3000/update-mark", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log(result.message);

          // Disable input boxes after updating
          row.querySelectorAll(".marksInput").forEach((input) => {
            input.disabled = true;
          });
          location.reload();
        } catch (error) {
          console.error("Error updating marks:", error);
        }
      }
    }
  });
}

const notesForm = document.querySelector(".noteFrom");
if (notesForm) {
  console.log("Form found");

  document.addEventListener("DOMContentLoaded", function () {
    const semInput = notesForm.querySelector(".sem");
    const subInput = notesForm.querySelector(".sub");
    const fileInput = notesForm.querySelector(".input_file");
    const addButton = notesForm.querySelector(".btn-add");

    // Event listener for changes in semester input
    semInput.addEventListener("input", function () {
      const selectedSemester = semInput.value;
      const storedUsername = sessionStorage.getItem("username");

      // Make a fetch request to get subjects based on semester and username
      fetch(
        `http://localhost:3000/subjects?semester=${selectedSemester}&username=${encodeURIComponent(
          storedUsername
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Update the options in the subject datalist
          updateSubjectDatalist(data);
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    });

    // Event listener for changes in subject input
    subInput.addEventListener("input", function () {
      // Enable file input when subject is selected
      fileInput.removeAttribute("disabled");
    });

    // Event listener for changes in file input
    fileInput.addEventListener("change", function () {
      // Enable add button when file is selected
      addButton.removeAttribute("disabled");
    });

    // Event listener for form submission
    notesForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form data
      const faculty_id = sessionStorage.getItem("username");
      const noteName = notesForm.querySelector(".notes_name").value;
      const semester = semInput.value;
      const subject = subInput.value;
      const file = fileInput.files[0];

      // Create a FormData object to append form data
      const formData = new FormData();
      formData.append("faculty_id", faculty_id);
      formData.append("noteName", noteName);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("file", file);

      // Make a fetch request to upload the file and insert details into the database
      fetch("http://localhost:3000/uploadAndInsert", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);

          // Optionally, display a success message to the user
          const messageElement = document.getElementById("message");
          messageElement.textContent = "Note added successfully!";
          location.reload();
          // Clear the form
          notesForm.reset();
        })
        .catch((error) => {
          console.error("Error uploading file and inserting details:", error);
        });
    });

    function updateSubjectDatalist(subjects) {
      const datalist = document.querySelector("#sub");
      datalist.innerHTML = ""; // Clear existing options

      subjects.forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject;
        datalist.appendChild(option);
      });

      // Enable subject input
      subInput.removeAttribute("disabled");
    }
  });
}

const notesTable = document.getElementById("noteTable");
if (notesTable) {
  // Assuming you have a function to fetch notes details from the API
  async function fetchNotesDetails() {
    try {
      const storedUsername = sessionStorage.getItem("username");

      const response = await fetch(
        `http://localhost:3000/fetchNotes?username=${encodeURIComponent(
          storedUsername
        )}`
      );
      const data = await response.json();

      if (data.notesDetails) {
        populateTable(data.notesDetails);
      } else {
        console.error("Error fetching notes details:", data.error);
      }
    } catch (error) {
      console.error("Error fetching notes details:", error);
    }
  }

  // Function to populate the table with notes details
  function populateTable(notesDetails) {
    const tableBody = document.getElementById("noteTable");

    // Clear existing table rows
    // tableBody.innerHTML = "";

    // Iterate through notes details and create table rows
    notesDetails.forEach((note) => {
      const row = tableBody.insertRow();
      const viewButton = document.createElement("input");
      const deleteButton = document.createElement("input");

      // Add data to the row
      row.insertCell(0).textContent = note.note_name;
      row.insertCell(1).textContent = note.semester;
      row.insertCell(2).textContent = note.subject;

      // Create view button
      viewButton.type = "button";
      viewButton.value = "View";
      viewButton.classList.add("viewButtom");
      viewButton.addEventListener("click", () => openFileInNewPage(note.path));
      row.insertCell(3).appendChild(viewButton);

      // Create delete button
      deleteButton.type = "button";
      deleteButton.value = "Delete";
      deleteButton.classList.add("deleteButton");
      deleteButton.addEventListener("click", () =>
        deleteNoteById(note.note_id)
      );
      row.insertCell(4).appendChild(deleteButton);
    });
  }

  // Function to open the file in a new page
  function openFileInNewPage(filePath) {
    window.open(filePath, "_blank");
  }

  // Function to delete a note by ID
  async function deleteNoteById(noteId) {
    try {
      const response = await fetch(
        `http://localhost:3000/deleteNote/${noteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      console.log(data.message);

      // Refresh the table after deletion
      location.reload();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  // Call the fetchNotesDetails function to initialize the table
  fetchNotesDetails();
}
