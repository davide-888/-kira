const SERVER = "https://kira-ai91.onrender.com";

async function api(path, body = {}) {
  const res = await fetch(`${SERVER}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return await res.json();
}
