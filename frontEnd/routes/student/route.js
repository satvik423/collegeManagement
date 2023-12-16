const storedUsername = sessionStorage.getItem("username");
const studentTable = document.getElementById("studentTable");

if (studentTable) {
  document.addEventListener("DOMContentLoaded", function () {
    let totals = {
      MS1: 0,
      MS2: 0,
      SEM: 0,
      Total: 0,
    };
    let totalCols = 0;
    fetch(
      `http://localhost:3000/fetchMarks?username=${encodeURIComponent(
        storedUsername
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.marksDetails) {
          renderMarksTable(data.marksDetails);
          calculateTotals(data.marksDetails);
          renderTotals();
          renderPercentages();
        } else {
          console.error("Error fetching marks data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    function renderMarksTable(marksDetails) {
      const tableBody = document.createElement("tbody");

      marksDetails.forEach((marks) => {
        const row = document.createElement("tr");

        Object.values(marks).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          row.appendChild(td);
        });

        tableBody.appendChild(row);
      });

      // Append the table body to the studentTable
      studentTable.appendChild(tableBody);
    }

    function calculateTotals(marksDetails) {
      marksDetails.forEach((marks) => {
        totals.MS1 += parseInt(marks.MS1, 10);
        totals.MS2 += parseInt(marks.MS2, 10);
        totals.SEM += parseInt(marks.SEM, 10);
        totals.Total += parseInt(marks.Total, 10);
        totalCols += 1;
      });
    }

    console.log(totals.MS1);
    function renderTotals() {
      const totalsRow = document.createElement("tr");
      const totaltd = document.createElement("td");
      totaltd.textContent = "Total";
      totalsRow.appendChild(totaltd);

      Object.values(totals).forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        totalsRow.appendChild(td);
      });

      // Append the totals row to the studentTable
      studentTable.appendChild(totalsRow);
    }
    function renderPercentages() {
      const percentagesRow = document.createElement("tr");
      const percentagetd = document.createElement("td");
      percentagetd.textContent = "Percentage";
      percentagesRow.appendChild(percentagetd);

      Object.values(totals).forEach((value, index) => {
        const percentage =
          index === 3
            ? ((value / (totalCols * 3 * 100)) * 100).toFixed(2)
            : ((value / (totalCols * 100)) * 100).toFixed(2);

        const td = document.createElement("td");
        td.textContent = `${percentage}%`;
        percentagesRow.appendChild(td);
      });

      // Append the percentages row to the studentTable
      studentTable.appendChild(percentagesRow);
    }
  });
}

const noteTable = document.getElementById("noteTable");
if (noteTable) {
  // Function to fetch notes details and populate the table
  function fetchAndPopulateNotes() {
    const storedUsername = sessionStorage.getItem("username");

    fetch(
      `http://localhost:3000/fetchNotes-student?username=${encodeURIComponent(
        storedUsername
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.notesDetails) {
          renderNotesTable(data.notesDetails);
        } else {
          console.error("Error fetching notes data:", data.error);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  // Function to render the notes table
  function renderNotesTable(notesDetails) {
    const tableBody = document.createElement("tbody");

    notesDetails.forEach((note) => {
      const row = document.createElement("tr");

      // Populate table cells with note details
      const noteNameCell = document.createElement("td");
      noteNameCell.textContent = note.note_name;
      row.appendChild(noteNameCell);

      const subjectCell = document.createElement("td");
      subjectCell.textContent = note.subject;
      row.appendChild(subjectCell);

      const facultyCell = document.createElement("td");
      facultyCell.textContent = note.faculty_name;
      row.appendChild(facultyCell);

      // Create a view button with an event listener to open the file in a new page
      const viewButton = document.createElement("input");
      viewButton.type = "button";
      viewButton.value = "View";
      viewButton.addEventListener("click", () => openFileInNewPage(note.path));

      const viewCell = document.createElement("td");
      viewCell.appendChild(viewButton);
      row.appendChild(viewCell);

      tableBody.appendChild(row);
    });

    // Append the table body to the noteTable
    noteTable.appendChild(tableBody);
  }

  // Function to open the file in a new page (replace this with your actual implementation)
  function openFileInNewPage(filePath) {
    // Replace this with your code to open the file in a new page
    window.open(filePath, "_blank");
  }

  // Fetch and populate notes when the DOM is loaded
  document.addEventListener("DOMContentLoaded", fetchAndPopulateNotes);
}
