const axios = require("axios");

async function getWeather(city) {
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;

  const res = await axios.get(url);
  return `🌦️ ${res.data}`;
}

module.exports = { getWeather };
