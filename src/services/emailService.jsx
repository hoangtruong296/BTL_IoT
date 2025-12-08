import emailjs from "@emailjs/browser";

emailjs.init("YOUR_PUBLIC_KEY");

export async function sendAlertEmail(message) {
  const email = localStorage.getItem("alertEmail");
  if (!email) {
    console.warn("Chưa thiết lập email cảnh báo.");
    return;
  }

  // Kiểm tra định dạng email
  const validFormat = /\S+@\S+\.\S+/.test(email);
  if (!validFormat) {
    console.warn("Email không hợp lệ:", email);
    return;
  }

  try {
    const result = await emailjs.send(
      "YOUR_SERVICE_ID",   // Thay bằng Service ID thật
      "YOUR_TEMPLATE_ID",  // Thay bằng Template ID thật
      {
        to_email: email,
        time: new Date().toLocaleString(),
        message: message,
      }
    );

    console.log("Email cảnh báo đã được gửi!", result);
    return result;
  } catch (err) {
    console.error(" Lỗi gửi Email:", err);
    return null;
  }
}
