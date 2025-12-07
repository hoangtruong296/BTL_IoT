import React, { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const lastStatus = useRef("good");      // tránh gửi email lặp lại
  const lastEmailTime = useRef(0);        // cooldown gửi email

  const THINGSBOARD_URL = "https://thingsboard.cloud";
  const DEVICE_ID = "c760e590-bbe0-11f0-8069-45b80ed85c71";
  const JWT_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGhjbG9uZTJAZ21haWwuY29tIiwidXNlcklkIjoiZjY0MzQzZDAtYTMyYi0xMWYwLWIxNTAtMjcxMGE4OTE1ZTFkIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJkYTBmYTI2MS0zNWMwLTQ2YjEtYmFjNS04ZDk0YTU0ZmUwMzIiLCJleHAiOjE3NjUxNDcwNjUsImlzcyI6InRoaW5nc2JvYXJkLmNsb3VkIiwiaWF0IjoxNzY1MTE4MjY1LCJmaXJzdE5hbWUiOiJCMjJEQ0FUMTMwLVRyxrDGoW5nIEh1eSBIb8OgbmciLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsImlzQmlsbGluZ1NlcnZpY2UiOmZhbHNlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsInRlcm1zT2ZVc2VBY2NlcHRlZCI6dHJ1ZSwidGVuYW50SWQiOiJmNjE4M2MzMC1hMzJiLTExZjAtYjE1MC0yNzEwYTg5MTVlMWQiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.v-d1OSTQfIb7BEtzqnVyGMw2PTBfheZ0uPgyuAITxBG85LZu2YZ9T5-n1-G83Bd_25nIUB_M9-TU6bzznSxRCA";

  // ---- Khởi tạo emailjs ----
  useEffect(() => {
    emailjs.init("YOUR_PUBLIC_KEY");
  }, []);

  const fetchData = async () => {
    try {
      const now = Date.now();
      const oneMinAgo = now - 60 * 1000;

      const url = `${THINGSBOARD_URL}/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=ph,temperature,tds&startTs=${oneMinAgo}&endTs=${now}&interval=1000&limit=60`;

      const res = await fetch(url, {
        headers: { "X-Authorization": `Bearer ${JWT_TOKEN}` },
      });

      const json = await res.json();
      if (!json.ph) return;

      const newData = json.ph.map((_, i) => ({
        time: new Date(json.ph[i].ts).toLocaleTimeString(),
        ph: parseFloat(json.ph[i]?.value || 0),
        temperature: parseFloat(json.temperature?.[i]?.value || 0),
        tds: parseFloat(json.tds?.[i]?.value || 0),
      }));

      setData(newData);

      // Đánh giá chất lượng nước
      const newest = newData[newData.length - 1];
      const result = evaluateWater(newest);

      // Nếu trạng thái từ GOOD → BAD, gửi email
      if (result.status === "bad" && lastStatus.current === "good") {
        sendEmailAlert(result.message);
      }

      lastStatus.current = result.status;

    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  const evaluateWater = ({ ph, temperature, tds }) => {
    let status = "good";
    let msg = [];

    if (ph < 6.5 || ph > 8.5) {
      status = "bad";
      msg.push("pH không đạt chuẩn (6.5 - 8.5)");
    }
    if (temperature < 10 || temperature > 45) {
      status = "bad";
      msg.push("Nhiệt độ bất thường");
    }
    if (tds > 500) {
      status = "bad";
      msg.push("TDS cao (>500 ppm)");
    }

    return { status, message: msg.join(", ") };
  };

  const sendEmailAlert = (message) => {
    const email = localStorage.getItem("alertEmail");
    if (!email) return;

    const now = Date.now();
    if (now - lastEmailTime.current < 5 * 60 * 1000) {
      // Cooldown 5 phút
      return;
    }

    lastEmailTime.current = now;

    emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        to_email: email,
        time: new Date().toLocaleString(),
        message,
      }
    )
      .then(() => console.log("Email đã gửi"))
      .catch(err => console.error("Lỗi gửi email:", err));
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app">
      <h1>💧 Giám sát chất lượng nước 💧</h1>

      {/* Nhập email */}
      <div className="cards">
        <h2>Email cảnh báo</h2>
        <input
          type="email"
          placeholder="Nhập email..."
          defaultValue={localStorage.getItem("alertEmail") || ""}
          onChange={(e) => localStorage.setItem("alertEmail", e.target.value)}
        />
      </div>

      {/* Giá trị mới nhất */}
      <div className="cards">
        <div className="card"><h2>pH</h2><p>{data.at(-1)?.ph || "--"}</p></div>
        <div className="card"><h2>Nhiệt độ</h2><p>{data.at(-1)?.temperature || "--"}</p></div>
        <div className="card"><h2>TDS</h2><p>{data.at(-1)?.tds || "--"}</p></div>
      </div>

      {/* Biểu đồ */}
      <div className="chart-container">
        {renderChart("pH", "ph", data)}
        {renderChart("Nhiệt độ (°C)", "temperature", data)}
        {renderChart("TDS", "tds", data)}
      </div>
    </div>
  );
}

function renderChart(label, key, data) {
  return (
    <>
      <h3>{label}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={key} stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default App;
