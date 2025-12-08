const TB_URL = "https://thingsboard.cloud/api/plugins/telemetry/DEVICE";
const DEVICE_ID = "81c7a1f0-d34a-11f0-82a9-69e5355364db"; // Thay bằng ID của bạn
const TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiaTEyYml5QGdtYWlsLmNvbSIsInVzZXJJZCI6IjU5NTNjYzMwLWQzNGEtMTFmMC04ZDI3LTlmODdjMzUxZWRkOCIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwic2Vzc2lvbklkIjoiNTRkZjJkNGYtNzk5OC00NTE5LTliMGEtOTRlMjJlMTNhNjNiIiwiZXhwIjoxNzY1MTk0MTk3LCJpc3MiOiJ0aGluZ3Nib2FyZC5jbG91ZCIsImlhdCI6MTc2NTE2NTM5NywiZmlyc3ROYW1lIjoiUGjhuqFtIFbEg24gS2jhuqNpIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJpc0JpbGxpbmdTZXJ2aWNlIjpmYWxzZSwicHJpdmFjeVBvbGljeUFjY2VwdGVkIjp0cnVlLCJ0ZXJtc09mVXNlQWNjZXB0ZWQiOnRydWUsInRlbmFudElkIjoiNTkyYzZlMTAtZDM0YS0xMWYwLThkMjctOWY4N2MzNTFlZGQ4IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.dr0LZw87L2WLcGLIj9fMRM7y0Z31K-fbBU4XUqYa7McdihzZ31pprte1_kmh9WkAQ6bQ_wcFu35G3o60ft7DVg"; // JWT token từ ThingsBoard (user account)

export async function fetchTelemetry() {
  const now = Date.now();
  const oneMinAgo = now - 60000;
  const url = `${TB_URL}/${DEVICE_ID}/values/timeseries?keys=ph,temperature,tds&startTs=${oneMinAgo}&endTs=${now}&interval=1000&limit=60`;

  const res = await fetch(url, {
    headers: { "X-Authorization": `Bearer ${TOKEN}` },
  });
  const json = await res.json();

  if (!json.ph) return [];

  return json.ph.map((_, i) => ({
    time: new Date(json.ph[i].ts).toLocaleTimeString(),
    ph: parseFloat(json.ph[i]?.value || 0),
    temperature: parseFloat(json.temperature?.[i]?.value || 0),
    tds: parseFloat(json.tds?.[i]?.value || 0),
  }));
}
