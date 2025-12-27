const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("Missing TG_BOT_TOKEN or TG_CHAT_ID");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Telegram proxy is running ✅");
});

app.post("/location", async (req, res) => {
  try {
    const { lat, lon, text } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat/lon" });
    }

    if (text) {
      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text: text
        }
      );
    }

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`,
      {
        chat_id: CHAT_ID,
        latitude: lat,
        longitude: lon
      }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send to Telegram" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
