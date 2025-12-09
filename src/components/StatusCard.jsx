import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatusCard({ data }) {
  const latest = data.at(-1);
  if (!latest) return null;

  const ph = latest.ph ?? 0;
  const tds = latest.tds ?? 0;
  const temp = latest.temperature ?? 0;

  let status = "ĐẠT";
  let color = "green";
  let messages = [];

  // --- Kiểm tra nhiều điều kiện ---
  if (ph < 6.5 || ph > 8.5) {
    messages.push("pH không đạt (6.5 – 8.5)");
  }

  if (tds > 500 ) {
    messages.push("TDS cao (>500 ppm)");
  }

  if (temp < 10 || temp > 27) {
    messages.push("Nhiệt độ bất thường");
  }

  // Nếu có lỗi thì đổi trạng thái
  if (messages.length > 0) {
    status = "Không đạt";
    color = "red";
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trạng thái
        </Typography>

        <Typography>pH: {ph.toFixed(2)}</Typography>
        <Typography>TDS: {tds.toFixed(0)} ppm</Typography>
        <Typography>Nhiệt độ: {temp.toFixed(1)} °C</Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ color, fontWeight: "bold" }}>
            Đánh giá: {status}
          </Typography>

          {messages.length > 0 && (
            <Typography
              variant="body2"
              sx={{ mt: 1, whiteSpace: "pre-line" }}
            >
              {messages.join("\n")} 
              {/* xuống dòng cho dễ đọc */}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
