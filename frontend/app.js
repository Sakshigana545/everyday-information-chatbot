
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.getElementById("typing-indicator");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function(e){
  if(e.key === "Enter") sendMessage();
});

function sendMessage(){
  const message = userInput.value.trim();
  if(message === "") return;

  // Add user message
  addMessage(message, "user-message");
  userInput.value = "";

  // Show typing indicator
  typingIndicator.style.display = "block";

  // Simulate bot response delay
  setTimeout(() => {
    typingIndicator.style.display = "none";
    const botReply = generateBotReply(message);
    addMessage(botReply, "bot-message");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
}

function addMessage(msg, className){
  const div = document.createElement("div");
  div.classList.add("message", className);
  div.innerText = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple bot responses
function generateBotReply(msg){
  const lower = msg.toLowerCase();
  if(lower.includes("joke")) return "Why did the computer go to the doctor? Because it caught a virus!";
  if(lower.includes("weather")) return "I can't get real weather yet, but it's always sunny in code-world 🌞";
  if(lower.includes("finance")) return "Stock markets fluctuate! Always invest wisely.";
  return "I am a simple bot. You can ask me for jokes, finance, or weather!";
}
