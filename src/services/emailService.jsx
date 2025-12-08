import emailjs from "@emailjs/browser";

emailjs.init("jWsyQ3HWZ8VwrjMxg");  // Chỉ ID chuỗi

export async function sendAlertEmail(message) {
  let emails = JSON.parse(localStorage.getItem("alertEmails") || "[]");

  if (!emails.length) {
    console.warn("Không có email cảnh báo nào.");
    return;
  }

  for (const email of emails) {
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) continue;

    try {
      await emailjs.send(
        "service_jbtje2v",
        "template_iuesurd",
        {
          name: "Cảnh báo nước",
          title: "Cảnh báo chất lượng nước",
          time: new Date().toLocaleString(),
          message,
          to_email: email
        }
      );

      console.log("Đã gửi email cảnh báo đến:", email);
    } catch (err) {
      console.error("Lỗi gửi Email đến:", email, err);
    }
  }
}
