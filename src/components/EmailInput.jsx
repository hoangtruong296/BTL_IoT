import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [open, setOpen] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("alertEmails") || "[]");
    setEmails(saved);
  }, []);

  const handleSave = () => {
    const format = /\S+@\S+\.\S+/.test(email);
    if (!format) {
      setOpen({ show: true, msg: "Email không hợp lệ", type: "error" });
      return;
    }

    const newList = [...emails, email];
    setEmails(newList);
    localStorage.setItem("alertEmails", JSON.stringify(newList));

    setOpen({ show: true, msg: "Đã thêm email!", type: "success" });
    setEmail("");
  };

  const handleDelete = (emailToDelete) => {
    const newList = emails.filter((e) => e !== emailToDelete);
    setEmails(newList);
    localStorage.setItem("alertEmails", JSON.stringify(newList));

    setOpen({ show: true, msg: "Đã xóa email!", type: "info" });
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Danh sách email nhận cảnh báo
        </Typography>

        {/* Ô nhập email */}
        <TextField
          fullWidth
          label="Nhập email..."
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ textTransform: "none", fontWeight: "bold", mb: 2 }}
        >
          Thêm email
        </Button>

        {/* Danh sách email đã lưu */}
        <List dense>
          {emails.map((e, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton onClick={() => handleDelete(e)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText primary={e} />
            </ListItem>
          ))}
        </List>

        <Snackbar
          open={open.show}
          autoHideDuration={2000}
          onClose={() => setOpen({ ...open, show: false })}
        >
          <Alert severity={open.type} variant="filled">
            {open.msg}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
