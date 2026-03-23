// const express = require("express");
// const router = express.Router();

// // GET
// router.get("/welcome", (req, res) => {
//   res.json({ message: "Welcome to Normal API 🚀" });
// });

// // POST
// router.post("/hello", (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: "Name required" });

//   res.json({ message: `Hello ${name} 👋` });
// });

// // PUT
// router.put("/user/:id", (req, res) => {
//   res.json({
//     message: "User updated fully",
//     id: req.params.id
//   });
// });

// // PATCH
// router.patch("/user/:id", (req, res) => {
//   res.json({
//     message: "User updated partially",
//     id: req.params.id
//   });
// });

// // DELETE
// router.delete("/user/:id", (req, res) => {
//   res.json({
//     message: "User deleted",
//     id: req.params.id
//   });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

// GET
router.get("/welcome", (req, res) => {
  res.json({ message: "Welcome to Normal API 🚀" });
});

// ✅ NEW CHATBOT ROUTE (added without removing anything)
router.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const lowerMsg = message.toLowerCase();

  // Name question
  if (lowerMsg.includes("what is your name")) {
    return res.json({ reply: "I am Sora chatbot 🤖" });
  }

  // Work question (handles multiple variations)
  if (
    lowerMsg.includes("what you do") ||
    lowerMsg.includes("what do you do") ||
    lowerMsg.includes("what is you do") ||
    lowerMsg.includes("what u do")
  ) {
    return res.json({
      reply: "I help answer your questions and assist you 🚀"
    });
  }

  // Default reply
  res.json({ reply: "Sorry, I don't understand that yet 😅" });
});

// POST
router.post("/hello", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  res.json({ message: `Hello ${name} 👋` });
});

// PUT
router.put("/user/:id", (req, res) => {
  res.json({
    message: "User updated fully",
    id: req.params.id
  });
});

// PATCH
router.patch("/user/:id", (req, res) => {
  res.json({
    message: "User updated partially",
    id: req.params.id
  });
});

// DELETE
router.delete("/user/:id", (req, res) => {
  res.json({
    message: "User deleted",
    id: req.params.id
  });
});

module.exports = router;
