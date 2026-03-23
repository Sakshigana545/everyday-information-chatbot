const mongoose = require("mongoose");

// Each individual message
const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Chat history per user
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [messageSchema]
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model("Chat", chatSchema);