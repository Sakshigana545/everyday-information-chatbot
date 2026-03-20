// const sendBtn = document.getElementById("send-btn");
// const userInput = document.getElementById("user-input");
// const messages = document.getElementById("messages");
// const chatTitle = document.getElementById("chat-title");

// sendBtn.addEventListener("click", sendMessage);
// userInput.addEventListener("keypress", function (e) {
//   if (e.key === "Enter") {
//     sendMessage();
//   }
// });

// async function sendMessage() {
//   const text = userInput.value.trim();
//   if (text === "") return;

//   // hide title
//   chatTitle.style.display = "none";

//   // show user message
//   addMessage(text, "user");
//   userInput.value = "";

//   try {
//     const response = await fetch("http://localhost:3000/api/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ message: text })
//     });

//     const data = await response.json();

//     addMessage(data.reply, "bot");

//   } catch (error) {
//     addMessage("Server error 😢 Please try again.", "bot");
//   }
// }

// function addMessage(text, sender) {
//   const msgDiv = document.createElement("div");
//   msgDiv.classList.add("message", sender);

//   const label = sender === "user" ? "You" : "Sora";

//   msgDiv.innerHTML = `<strong>${label}:</strong> ${text}`;

//   messages.appendChild(msgDiv);
//   messages.scrollTop = messages.scrollHeight;
// }

// function saveToHistory(message) {
//   let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
//   history.unshift(message); // latest on top
//   localStorage.setItem("chatHistory", JSON.stringify(history));
//   renderHistory();
// }
// function renderHistory() {
//   const historyList = document.getElementById("historyList");
//   historyList.innerHTML = "";

//   const history = JSON.parse(localStorage.getItem("chatHistory")) || [];

//   history.forEach(item => {
//     const li = document.createElement("li");
//     li.textContent = item;
//     historyList.appendChild(li);
//   });
// }
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("messages");
const chatTitle = document.getElementById("chat-title");
const historyList = document.getElementById("historyList");
const usernameSpan = document.getElementById("username");
const settingsBtn = document.querySelector(".sidebar-bottom");
const systemPanel = document.getElementById("systemPanel");

// Toggle system panel (if you have one)
settingsBtn?.addEventListener("click", () => {
  if (systemPanel) {
    systemPanel.style.display = systemPanel.style.display === "flex" ? "none" : "flex";
  }
});

// 🔐 Logged-in user
let user = JSON.parse(localStorage.getItem("user"));

// User-based history key
let historyKey = user ? `chatHistory_${user.email}` : null;

// Update username UI and login/signup buttons visibility
function updateUserUI() {
  if (!user) {
    usernameSpan.innerText = "Guest";
    document.querySelector(".btn-primary").style.display = "inline-block";
    document.querySelector(".signup").style.display = "inline-block";
    historyKey = null;
  } else {
    usernameSpan.innerText = user.name;
    document.querySelector(".btn-primary").style.display = "none";
    document.querySelector(".signup").style.display = "none";
    historyKey = `chatHistory_${user.email}`;
  }
}

// Logout function
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  user = null;
  updateUserUI();

  messages.innerHTML = "";
  chatTitle.style.display = "block";
  historyList.innerHTML = "";
}

// Save message to history with sender info
function saveToHistory(text, sender) {
  if (!historyKey) return;

  let history = JSON.parse(localStorage.getItem(historyKey)) || [];

  if (typeof text === "string" && sender) {
    history.unshift({ sender, text });

    // Keep max 50 messages
    if (history.length > 50) history.pop();

    localStorage.setItem(historyKey, JSON.stringify(history));
    renderHistory();
  }
}
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Render chat history list in sidebar
function renderHistory() {
  if (!historyKey) return;

  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];

  history.forEach((msg, index) => {
    const previewText = (msg && typeof msg.text === "string") ? msg.text : "";
    const li = document.createElement("li");
    li.textContent = (msg.sender === "user" ? "You: " : "Sora: ") +
      (previewText.length > 30 ? previewText.slice(0, 30) + "..." : previewText);
    li.dataset.index = index;

  li.onclick = () => {
  messages.innerHTML = "";
  for (let i = history.length - 1; i >= 0; i--) {
    addMessage(history[i].text, history[i].sender);
  }
  chatTitle.style.display = "none";
};


    historyList.appendChild(li);
  });
}

// Add message UI to chat window
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;

  const label = sender === "user" ? "You" : "Sora";
  div.innerHTML = `<strong>${label}:</strong> ${text}`;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Send message function (called on button click or enter)
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  chatTitle.style.display = "none";
  addMessage(text, "user");
  userInput.value = "";

  if (user) saveToHistory(text, "user");

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    if (data.reply) {
      addMessage(data.reply, "bot");
      if (user) saveToHistory(data.reply, "bot");
    } else {
      addMessage("No reply from bot.", "bot");
    }
  } catch (error) {
    addMessage("Server error 😢", "bot");
  }
}

/* ============== EVENTS =============== */

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// System panel options
document.getElementById("logoutOption").addEventListener("click", () => {
  logoutUser();
  systemPanel.style.display = "none";
});

document.getElementById("clearChat").addEventListener("click", () => {
  messages.innerHTML = "";
  chatTitle.style.display = "block";
  systemPanel.style.display = "none";
});

document.getElementById("resetChat").addEventListener("click", () => {
  messages.innerHTML = "";
  chatTitle.style.display = "block";
  if (historyKey) {
    localStorage.removeItem(historyKey);
    renderHistory();
  }
  systemPanel.style.display = "none";
});

document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  systemPanel.style.display = "none";
});

// On page load
window.onload = () => {
  updateUserUI();
  renderHistory();
};