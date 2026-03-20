document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // ✅ SAVE LOGIN STATE
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful!");

    // ✅ REDIRECT TO HOME
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
