document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const messageElement = document.getElementById("message");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Make a Fetch API request to your Node.js API endpoint
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.error) {
          // Display error message
          //   alert(data.message);
          messageElement.textContent = data.message;
        } else {
          // Redirect to the appropriate page
          window.location.href = data.redirect;
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  });
