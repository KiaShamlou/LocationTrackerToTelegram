{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import fetch from "node-fetch";\
\
const app = express();\
app.use(express.json());\
\
const PORT = process.env.PORT || 3000;\
\
// \uc0\u9989  SAFE: READ FROM ENV (NOT HARDCODED)\
const BOT_TOKEN = process.env.TG_BOT_TOKEN;\
const CHAT_ID = process.env.TG_CHAT_ID;\
\
app.get("/", (_, res) => \{\
  res.send("Telegram proxy is running \uc0\u9989 ");\
\});\
\
app.post("/location", async (req, res) => \{\
  try \{\
    const \{ lat, lon, time \} = req.body;\
\
    if (lat == null || lon == null) \{\
      return res.status(400).json(\{ error: "lat/lon required" \});\
    \}\
\
    const text = `\uc0\u55357 \u56525  Location update\\n\u55357 \u56658  $\{time || new Date().toISOString()\}`;\
\
    // Send text first\
    await fetch(`https://api.telegram.org/bot$\{BOT_TOKEN\}/sendMessage`, \{\
      method: "POST",\
      headers: \{ "Content-Type": "application/json" \},\
      body: JSON.stringify(\{\
        chat_id: CHAT_ID,\
        text,\
        disable_notification: true\
      \})\
    \});\
\
    // Then send location bubble\
    await fetch(`https://api.telegram.org/bot$\{BOT_TOKEN\}/sendLocation`, \{\
      method: "POST",\
      headers: \{ "Content-Type": "application/json" \},\
      body: JSON.stringify(\{\
        chat_id: CHAT_ID,\
        latitude: lat,\
        longitude: lon,\
        disable_notification: true\
      \})\
    \});\
\
    res.json(\{ ok: true \});\
  \} catch (err) \{\
    console.error(err);\
    res.status(500).json(\{ ok: false \});\
  \}\
\});\
\
app.listen(PORT, () => \{\
  console.log("Server started on port", PORT);\
\});\
}