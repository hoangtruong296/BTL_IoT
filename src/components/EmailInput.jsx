import React from "react";
import { TextField, Card, CardContent, Typography } from "@mui/material";

export default function EmailInput() {
  const handleChange = (e) => {
    localStorage.setItem("alertEmail", e.target.value);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Email cảnh báo
        </Typography>

        <TextField
          fullWidth
          label="Nhập email..."
          type="email"
          variant="outlined"
          defaultValue={localStorage.getItem("alertEmail") || ""}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
}
