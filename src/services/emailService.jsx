import emailjs from "@emailjs/browser";

emailjs.init("YOUR_PUBLIC_KEY");

let lastEmailTime = 0;

export async function sendAlertEmail(message) {
  const email = localStorage.getItem("alertEmail");
  if (!email) {
    console.warn("No alert email set.");
    return;
  }

  // Kiểm tra email hợp lệ (regex đơn giản)
  const validFormat = /\S+@\S+\.\S+/.test(email);
  if (!validFormat) {
    console.warn("Invalid email format:", email);
    return;
  }

  // Cooldown 5 phút
  const now = Date.now();
  if (now - lastEmailTime < 5 * 60 * 1000) {
    console.log("Cooldown active, email not sent.");
    return;
  }

  lastEmailTime = now;

  try {
    const result = await emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        to_email: email,
        time: new Date().toLocaleString(),
        message: message,
      }
    );

    console.log("Email sent successfully:", result);
    return result;

  } catch (err) {
    console.error("EmailJS ERROR:", err); // <-- SHOW REAL ERROR
    return null;
  }
}
