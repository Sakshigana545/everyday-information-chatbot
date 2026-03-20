const express = require("express");
const axios = require("axios");

const { getWeather } = require("../services/weather"); // 🌦️ weather.js

const router = express.Router();

/* ===============================
   📚 Wikipedia helper
================================ */
async function getWiki(topic) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    topic
  )}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "SoraChatBot/1.0 (learning project)"
    }
  });

  if (!res.data.extract) {
    throw new Error("No wiki data");
  }

  return res.data.extract;
}

/* ===============================
   💬 CHAT ROUTE
================================ */
router.post("/", async (req, res) => {
  if (!req.body.message) {
    return res.json({ reply: "Please type something 🙂" });
  }

  const userMessage = req.body.message.trim();
  const msg = userMessage.toLowerCase();

  /* 👋 GREETINGS */
  if (
    msg === "hi" ||
    msg === "hello" ||
    msg === "hi sora" ||
    msg === "hello sora"
  ) {
    return res.json({
      reply: "Hello 👋 How can I help you?"
    });
  }

  try {
    /* 😂 JOKES */
    if (msg.includes("joke")) {
      return res.json({
        reply:
          "Why do programmers prefer dark mode? Because light attracts bugs 😄"
      });
    }

    /* 🌦️ WEATHER (CITY BASED) */
    // Examples: "pune weather", "weather mumbai"
    if (msg.includes("weather")) {
      try {
        const city = msg.replace("weather", "").trim();

        if (!city) {
          return res.json({
            reply: "Please tell the city name 🙂"
          });
        }

        const weatherInfo = await getWeather(city);
        return res.json({ reply: weatherInfo });
      } catch (error) {
        return res.json({
          reply: "Could not fetch weather for this city 😕"
        });
      }
    }

    /* 📚 WIKIPEDIA (QUESTION BASED) */
    if (
      msg.startsWith("what is") ||
      msg.startsWith("who is") ||
      msg.startsWith("define") ||
      msg.startsWith("explain")
    ) {
      let topic = msg
        .replace("what is", "")
        .replace("who is", "")
        .replace("define", "")
        .replace("explain", "")
        .replace("?", "")
        .trim();

      if (!topic) {
        return res.json({ reply: "Please tell me the topic 🙂" });
      }

      try {
        const answer = await getWiki(topic);
        const shortAnswer =
          answer.split(". ").slice(0, 2).join(". ") + ".";

        return res.json({ reply: shortAnswer });
      } catch {
        return res.json({
          reply: "I couldn't find information on that topic 😕"
        });
      }
    }

    /* 📘 WIKIPEDIA (SINGLE WORD / SHORT TOPIC) */
    // Example: "india", "pune"
    if (
      msg.length <= 30 &&
      msg.split(" ").length <= 3 &&
      !msg.includes("weather") &&
      !msg.includes("joke")
    ) {
      try {
        const answer = await getWiki(msg);
        const shortAnswer =
          answer.split(". ").slice(0, 2).join(". ") + ".";

        return res.json({ reply: shortAnswer });
      } catch {
        // ignore & continue
      }
    }

    /* 💬 FALLBACK */
    return res.json({
      reply:
        "Try asking:\n• Pune weather\n• What is AI?\n• India\n• Tell me a joke 😄"
    });
  } catch (error) {
    return res.json({
      reply: "Something went wrong 😢"
    });
  }
});

module.exports = router;
