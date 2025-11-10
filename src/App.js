import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const THINGSBOARD_URL = "https://thingsboard.cloud";
  const DEVICE_ID = "c760e590-bbe0-11f0-8069-45b80ed85c71"; 
  const JWT_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aGhjbG9uZTJAZ21haWwuY29tIiwidXNlcklkIjoiZjY0MzQzZDAtYTMyYi0xMWYwLWIxNTAtMjcxMGE4OTE1ZTFkIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiI2NmNlOThjOS03YmFkLTRlZTctYTcwMS0yZGQ2NmUwNGExZGYiLCJleHAiOjE3NjI3MzAyNDgsImlzcyI6InRoaW5nc2JvYXJkLmNsb3VkIiwiaWF0IjoxNzYyNzAxNDQ4LCJmaXJzdE5hbWUiOiJCMjJEQ0FUMTMwLVRyxrDGoW5nIEh1eSBIb8OgbmciLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsImlzQmlsbGluZ1NlcnZpY2UiOmZhbHNlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsInRlcm1zT2ZVc2VBY2NlcHRlZCI6dHJ1ZSwidGVuYW50SWQiOiJmNjE4M2MzMC1hMzJiLTExZjAtYjE1MC0yNzEwYTg5MTVlMWQiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIn0.mz-pSiWeYpA05nt3XlSaqrUqX37Ap_YANOCJyhCRjF8WDOYwYLKWZRfqx6JTsGHGo5ep_3YkUD1YsP-L4fLcCw";

  const fetchData = async () => {
    try {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000; // lấy dữ liệu trong 1 phút gần nhất
      const url = `${THINGSBOARD_URL}/api/plugins/telemetry/DEVICE/${DEVICE_ID}/values/timeseries?keys=ph,temperature,tds&startTs=${oneMinuteAgo}&endTs=${now}&interval=1000&limit=60`;

      const res = await fetch(url, {
        headers: {
          "X-Authorization": `Bearer ${JWT_TOKEN}`,
        },
      });

      const json = await res.json();
      console.log("📊 Dữ liệu từ ThingsBoard:", json);

      // Nếu không có dữ liệu thì bỏ qua
      if (!json.ph) return;

      // Gom dữ liệu lại để phù hợp với Recharts
      const newData = json.ph.map((_, i) => ({
        time: new Date(json.ph[i].ts).toLocaleTimeString(),
        ph: parseFloat(json.ph[i].value),
        temperature: parseFloat(json.temperature?.[i]?.value || 0),
        tds: parseFloat(json.tds?.[i]?.value || 0),
      }));

      setData(newData);
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu từ ThingsBoard:", err);
    }
  };


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>💧 Bảng giám sát chất lượng nước 💧</h1>

      <div className="cards">
        <div className="card">
          <h2>Độ pH</h2>
          <p>{data[data.length - 1]?.ph || "--"}</p>
        </div>
        <div className="card">
          <h2>Nhiệt độ (°C)</h2>
          <p>{data[data.length - 1]?.temperature || "--"}</p>
        </div>
        <div className="card">
          <h2>Độ đục (TDS)</h2>
          <p>{data[data.length - 1]?.tds || "--"}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Độ pH</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Line type="monotone" dataKey="ph" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h3>Nhiệt độ (°C)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
            <Line type="monotone" dataKey="temperature" stroke="#82ca9d" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h3>Độ đục (TDS)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Line type="monotone" dataKey="tds" stroke="#ff7300" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default App;
