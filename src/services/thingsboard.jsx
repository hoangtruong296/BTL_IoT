const TB_URL = "https://thingsboard.cloud/api/plugins/telemetry/DEVICE";
const DEVICE_ID = "375560c0-b7f8-11f0-87ea-b9809c1a7a9e"; // Thay bằng ID của bạn
const TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZ3V5ZW1uaW5oMms0QGdtYWlsLmNvbSIsInVzZXJJZCI6IjQzNmYwNjAwLWI3ZjctMTFmMC04N2VhLWI5ODA5YzFhN2E5ZSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwic2Vzc2lvbklkIjoiNjFkYjlhNzAtZmVjYi00ZjQyLWFmZWEtY2M3ODQxNzZlMmNmIiwiZXhwIjoxNzY1Mjc3MzU5LCJpc3MiOiJ0aGluZ3Nib2FyZC5jbG91ZCIsImlhdCI6MTc2NTI0ODU1OSwiZmlyc3ROYW1lIjoiQjIyRENBVDE5MF9OZ3V54buFbiBI4buTbmcgTWluaCIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwiaXNCaWxsaW5nU2VydmljZSI6ZmFsc2UsInByaXZhY3lQb2xpY3lBY2NlcHRlZCI6dHJ1ZSwidGVybXNPZlVzZUFjY2VwdGVkIjp0cnVlLCJ0ZW5hbnRJZCI6IjQzM2RiY2QwLWI3ZjctMTFmMC04N2VhLWI5ODA5YzFhN2E5ZSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAifQ.MWZXx80DqSW0CxS-AK8YqCmQBibXFEmgbifCypY8InDiLEary-OjexbP8sQJm6tRJRaaVnJycBX8shaAGECmMg";

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


