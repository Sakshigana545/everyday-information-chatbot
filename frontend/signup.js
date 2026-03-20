document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // ✅ SAVE LOGIN STATE (THIS WAS MISSING EARLIER)
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Signup successful!");

    // ✅ REDIRECT TO HOME (INDEX PAGE)
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Server error. Please try again later.");
  }
});
