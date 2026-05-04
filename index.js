require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const token = process.env.TELEGRAM_BOT_TOKEN;
const geminiKey = process.env.GEMINI_KEY;
const PORT = process.env.PORT || 8080;

if (!token || !geminiKey) {
  console.log("❌ حط التوكن والـ GEMINI_KEY في .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const app = express();

console.log("✅ Bot is ready 🚀");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  try {
    await bot.sendChatAction(chatId, "typing");
    const result = await model.generateContent(text);
    const reply = result.response.text();
    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.log("Error:", err.message);
    await bot.sendMessage(chatId, "حصل ايرور يا معلم 😅 جرب تاني");
  }
});

app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
