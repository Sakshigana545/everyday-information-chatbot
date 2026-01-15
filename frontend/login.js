const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorMsg.style.display = "none";

  if (!email || !password) {
    showError("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Login failed");
      return;
    }

    // ✅ Save JWT & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful 🤖");
    window.location.href = "index.html";

  } catch (err) {
    showError("Server error. Please try again.");
  }
});

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
}

// Optional
document.getElementById("forgotPassword").onclick = () => {
  alert("Password recovery feature coming soon.");
};
