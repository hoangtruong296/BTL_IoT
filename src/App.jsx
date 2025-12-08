import React, { useEffect, useState, useRef } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { fetchTelemetry } from "./services/thingsboard";
import { sendAlertEmail } from "./services/emailService";
import { sendTelegramAlert } from "./services/telegramService"; //
import { evaluateWater } from "./utils/evaluateWater";
import LineChartCard from "./components/Charts/LineChartCard";
import EmailInput from "./components/EmailInput";
import SensorCard from "./components/SensorCard";
import StatusCard from "./components/StatusCard";

function App() {
  const [data, setData] = useState([]);
  const lastStatus = useRef("good");

  useEffect(() => {
    const fetchData = async () => {
      const newData = await fetchTelemetry();
      if (!newData.length) return;

      setData(newData);

      const newest = newData[newData.length - 1];
      const result = evaluateWater(newest);

      // Khi trạng thái xấu → gửi cảnh báo Email + Telegram
      if (result.status === "bad" ) {
        // Gửi email cảnh báo
        sendAlertEmail(result.message);

        // Gửi telegram cảnh báo
        const msg = `🚨 *CẢNH BÁO CHẤT LƯỢNG NƯỚC*\n${result.message}\n\n` +
                    `pH: ${newest.ph?.toFixed(2)}\n` +
                    `Nhiệt độ: ${newest.temperature?.toFixed(1)}°C\n` +
                    `TDS: ${newest.tds?.toFixed(0)} ppm\n` +
                    `Thời gian: ${new Date().toLocaleString()}`;
        sendTelegramAlert(msg);
      }

      lastStatus.current = result.status;
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Giám sát chất lượng nước 💧
      </Typography>

      <EmailInput />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <SensorCard data={data} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard data={data} />
        </Grid>
      </Grid>

      <LineChartCard label="pH" dataKey="ph" data={data} />
      <LineChartCard label="Nhiệt độ (°C)" dataKey="temperature" data={data} />
      <LineChartCard label="TDS (ppm)" dataKey="tds" data={data} />
    </Container>
  );
}

export default App;
