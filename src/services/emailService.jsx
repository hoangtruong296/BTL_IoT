import emailjs from "@emailjs/browser";

emailjs.init("TA84U9_j3h22RpNcM");  // chỉ truyền chuỗi, không phải object

export async function sendAlertEmail(message) {
  const email = localStorage.getItem("alertEmail");
  if (!email) return console.warn("Chưa thiết lập email.");


  // const validFormat = /\S+@\S+\.\S+/.test(email);
  // if (!validFormat) {
  //   console.warn("Email không hợp lệ:", email);
  //   return;
  // }

  try {
    const result = await emailjs.send(
      "service_t0dcwpl",   // service phải đúng
      "template_jpo7enq",  // template phải đúng
      {
        name: "Cảnh báo nước",
        title: "Cảnh báo chất lượng nước",
        time: new Date().toLocaleString(),
        message,
        to_email: email    // phải trùng biến trong template
      }
    );

    console.log("Email cảnh báo đã được gửi!", result);
    return result;

  } catch (err) {
    console.error("Lỗi gửi Email:", err);
    return null;
  }
}
