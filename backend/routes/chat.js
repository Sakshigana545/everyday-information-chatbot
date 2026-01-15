const express = require("express");
const router = express.Router();

/**
 * POST /api/chat
 * Body: { message: "Hello" }
 */
router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message is required" });
  }

  // TEMP reply (later we connect AI API)
  const botReply = `You said: ${userMessage}`;

  res.json({
    reply: botReply
  });
});

module.exports = router;
