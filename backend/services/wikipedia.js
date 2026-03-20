const axios = require("axios");

async function getWiki(topic) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "SoraChatBot/1.0 (learning project)"
    }
  });

  if (!res.data.extract) {
    throw new Error("No data found");
  }

  return res.data.extract;
}

module.exports = { getWiki };
