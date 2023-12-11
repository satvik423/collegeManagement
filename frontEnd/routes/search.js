function searchTable() {
  // Get input value and convert it to lowercase for case-insensitive search
  var input = document.querySelector(".search").value.toLowerCase();

  // Get the table body and rows
  var tableBody = document.querySelector(".table_body");
  var rows = tableBody.getElementsByTagName("tr");

  // Loop through each row starting from the second row (index 1) to exclude the header
  for (var i = 1; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var rowVisible = false;

    // Loop through each cell in the row
    for (var j = 0; j < cells.length; j++) {
      var cellText = cells[j].textContent.toLowerCase();

      // Check if the cell text contains the search input
      if (cellText.includes(input)) {
        rowVisible = true;
        break;
      }
    }

    // Show/hide the row based on the search result
    rows[i].style.display = rowVisible ? "" : "none";
  }
}
