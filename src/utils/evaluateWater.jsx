export function evaluateWater({ ph, temperature, tds }) {
  let status = "good";
  let msg = [];

  if (ph < 6.5 || ph > 8.5) {
    status = "bad";
    msg.push("pH không đạt chuẩn (6.5 - 8.5)");
  }
  if (temperature < 10 || temperature > 30) {
    status = "bad";
    msg.push("Nhiệt độ bất thường");
  }
  if (tds > 500 || tds < 0) {
    status = "bad";
    msg.push("TDS cao (>500 ppm) hoặc thấp (<0 ppm)");
  }

  return { status, message: msg.join(", ") };
}
