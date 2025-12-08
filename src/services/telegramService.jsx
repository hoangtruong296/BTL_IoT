import axios from "axios";

const BOT_TOKEN = "8275091683:AAEi2pa28ciel58b6HGysnVWmIsgdV4bIeE"; // tốt nhất lấy từ env

// Hàm lấy chat_id từ Telegram (qua getUpdates)
export async function getChatIds() {
  try {
    const res = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const updates = res.data.result || [];

    const ids = [...new Set(
      updates
        .filter(u => u.message && u.message.chat && u.message.chat.id)
        .map(u => u.message.chat.id)
    )];

    return ids;
  } catch (err) {
    console.error("getChatIds error:", err?.response?.data || err.message);
    return [];
  }
}

// Hàm gửi cảnh báo tới tất cả chat_id
export async function sendTelegramAlert(message) {
  const chatIds = await getChatIds();
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`; // <-- sửa: dùng backticks

  if (!chatIds.length) {
    console.warn("Không có chat_id nào (chưa ai Start bot).");
    return;
  }

  for (const id of chatIds) {
    try {
      // dùng URL-encoded body
      await axios.post(url, {
        chat_id: id,
        text: String(message),
        parse_mode: "HTML" // tùy chọn
      });
    } catch (err) {
      console.error(`Lỗi gửi tới chat_id=${id}:`, err?.response?.data || err.message);
    }
  }
}
