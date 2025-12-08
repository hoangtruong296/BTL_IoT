import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function SensorCard({ data }) {
  const latest = data.at(-1) || {};

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {[
        { label: "pH", value: latest.ph },
        { label: "Nhiệt độ (°C)", value: latest.temperature },
        { label: "TDS (ppm)", value: latest.tds },
      ].map((item, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {item.value ?? "--"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
