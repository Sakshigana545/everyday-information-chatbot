const express = require("express");
const router = express.Router();

// GET
router.get("/welcome", (req, res) => {
  res.json({ message: "Welcome to Normal API 🚀" });
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
s
