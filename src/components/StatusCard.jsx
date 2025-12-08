import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatusCard({ data }) {
  const latest = data.at(-1);
  // lấy phần tử cuối cùng của mảng
  if (!latest) return null;

  const ph = latest.ph ?? 0;
  const tds = latest.tds ?? 0;
  const temp = latest.temperature ?? 0;

  let status = "ĐẠT";
  let message = "";
  let color = "green";

  if (ph < 6.5 || ph > 8.5) {
    status = "Không đạt";
    message = "pH không đạt (6.5 – 8.5)";
    color = "red";
  } else if (tds > 500) {
    status = "Không đạt";
    message = "TDS cao (>500 ppm)";
    color = "red";
  } else if (temp < 10 || temp > 35) {
    status = "Không đạt";
    message = "Nhiệt độ bất thường (10 – 35°C)";
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
          {message && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
