// const express = require("express");
// const axios = require("axios");

// const Chat = require("../models/Chat");
// const { getWeather } = require("../services/weather"); // 🌦️ weather.js

// const router = express.Router();

// /* ===============================
//    📚 Wikipedia helper
// ================================ */
// async function getWiki(topic) {
//   const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
//     topic
//   )}`;

//   const res = await axios.get(url, {
//     headers: {
//       "User-Agent": "SoraChatBot/1.0 (learning project)"
//     }
//   });

//   if (!res.data.extract) {
//     throw new Error("No wiki data");
//   }

//   return res.data.extract;
// }

// /* ===============================
//    💬 CHAT ROUTE
// ================================ */
// router.post("/", async (req, res) => {
//   console.log("Incoming:", req.body);
//   if (!req.body.message) {
//     return res.json({ reply: "Please type something 🙂" });
//   }

//   const userMessage = req.body.message.trim();
//   const msg = userMessage.toLowerCase();

//   /* 👋 GREETINGS */
//   if (
//     msg === "hi" ||
//     msg === "hello" ||
//     msg === "hi sora" ||
//     msg === "hello sora"
//   ) {
//     return res.json({
//       reply: "Hello 👋 How can I help you?"
//     });
//   }

//   try {
//     /* 😂 JOKES */
//     if (msg.includes("joke")) {
//       return res.json({
//         reply:
//           "Why do programmers prefer dark mode? Because light attracts bugs 😄"
//       });
//     }

//     /* 🌦️ WEATHER (CITY BASED) */
//     // Examples: "pune weather", "weather mumbai"
//     if (msg.includes("weather")) {
//       try {
//         const city = msg.replace("weather", "").trim();

//         if (!city) {
//           return res.json({
//             reply: "Please tell the city name 🙂"
//           });
//         }

//         const weatherInfo = await getWeather(city);
//         return res.json({ reply: weatherInfo });
//       } catch (error) {
//         return res.json({
//           reply: "Could not fetch weather for this city 😕"
//         });
//       }
//     }

//     /* 💬 FALLBACK */
//     return res.json({
//       reply:
//         "Try asking:\n• Pune weather\n• What is AI?\n• India\n• Tell me a joke 😄"
//     });
//   } catch (error) {
//     return res.json({
//       reply: "Something went wrong 😢"
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const axios = require("axios");

const Chat = require("../models/Chat");
const { getWeather } = require("../services/weather");

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
   💬 CHAT ROUTE (FINAL)
================================ */
router.post("/", async (req, res) => {
  console.log("Incoming:", req.body);

  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.json({ reply: "Please type something 🙂" });
  }

  const userMessage = message.trim();
  const msg = userMessage.toLowerCase();

  let reply =
    "Try asking:\n• Pune weather\n• What is AI?\n• India\n• Tell me a joke 😄";

  try {
    /* 👋 GREETINGS */
    if (
      msg === "hi" ||
      msg === "hello" ||
      msg === "hi sora" ||
      msg === "hello sora"
    ) {
      reply = "Hello 👋 How can I help you?";
    }

    /* 😂 JOKES */
    else if (msg.includes("joke")) {
      reply =
        "Why do programmers prefer dark mode? Because light attracts bugs 😄";
    }

    /* 🌦️ WEATHER */
    else if (msg.includes("weather")) {
      const city = msg.replace("weather", "").trim();

      if (!city) {
        reply = "Please tell the city name 🙂";
      } else {
        try {
          const weatherInfo = await getWeather(city);
          reply = weatherInfo;
        } catch {
          reply = "Could not fetch weather for this city 😕";
        }
      }
    }

    /* 📚 WIKIPEDIA (questions) */
    else if (
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
        reply = "Please tell me the topic 🙂";
      } else {
        try {
          const answer = await getWiki(topic);
          reply = answer.split(". ").slice(0, 2).join(". ") + ".";
        } catch {
          reply = "I couldn't find information on that topic 😕";
        }
      }
    }

    /* 📘 WIKIPEDIA (short topics like "india") */
    else if (
      msg.length <= 30 &&
      msg.split(" ").length <= 3 &&
      !msg.includes("weather") &&
      !msg.includes("joke")
    ) {
      try {
        const answer = await getWiki(msg);
        reply = answer.split(". ").slice(0, 2).join(". ") + ".";
      } catch {
        // ignore and use fallback
      }
    }

    /* ===============================
       💾 SAVE TO MONGODB
    ============================== */

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    chat.messages.push({ sender: "user", text: userMessage });
    chat.messages.push({ sender: "bot", text: reply });

    await chat.save();

    console.log("Saved to DB ✅");

    /* ===============================
       📤 SEND RESPONSE
    ============================== */
    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Something went wrong 😢" });
  }
});

/* ===============================
   🕒 GET CHAT HISTORY
================================ */
router.get("/history/:userId", async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;