const express = require("express");
const router = express.Router();

// GET random joke from FREE API
router.get("/random", async (req, res) => {
  try {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );

    const joke = await response.json();

    res.json({
      source: "official-joke-api",
      setup: joke.setup,
      punchline: joke.punchline
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch joke"
    });
  }
});

module.exports = router;
