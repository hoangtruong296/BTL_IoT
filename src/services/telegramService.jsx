import axios from "axios";

const BOT_TOKEN = "8275091683:AAEi2pa28ciel58b6HGysnVWmIsgdV4bIeE"; // token bot của bạn
const CHAT_ID = "7136051108"; // chat ID cá nhân hoặc group

export async function sendTelegramAlert(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log(" Đã gửi cảnh báo Telegram!");
  } catch (err) {
    console.error(" Lỗi gửi Telegram:", err.message);
  }
}
