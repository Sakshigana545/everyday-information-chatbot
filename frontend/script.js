const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messages = document.getElementById("messages");
const chatTitle = document.getElementById("chat-title");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  // 🔥 hide title after first message
  chatTitle.style.display = "none";

  // show user message
  addMessage(text, "user");

  userInput.value = "";

  setTimeout(() => {
    const reply = getBotReply(text);
    addMessage(reply, "bot");
  }, 500);
}

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerText = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

function getBotReply(userText) {
  if (userText.toLowerCase().includes("hello")) {
    return "Hello 😊 How can I help you?";
  }
  if (userText.toLowerCase().includes("who are you")) {
    return "I am Sora, your assistant.";
  }
  return "I'm listening 👀 Tell me more.";
}
