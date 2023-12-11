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
          messageElement.textContent = data.message;
        } else {
          sessionStorage.setItem("username", username);

          // Redirect to the appropriate page with the username as a query parameter
          window.location.href = `${
            data.redirect
          }?username=${encodeURIComponent(username)}`;
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  });
