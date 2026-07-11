let clicks = 0;
let energy = 200;
let rotation = 0;

// Inizializza utente sul server
async function initUser() {
  const telegramId = "testUser"; // poi lo sostituisci con Telegram Mini App
  const res = await fetch("https://kira-ai91.onrender.com/api/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();
  clicks = data.clicks;
  energy = data.energy;

  updateUI();
}

function updateUI() {
  document.getElementById("clicks").innerText = clicks;
}

async function tapDog() {
  if (energy <= 0) {
    alert("No energy! Recharge first.");
    return;
  }

  rotation += 1;
  document.getElementById("dog").style.transform = `rotate(${rotation}deg)`;

  const telegramId = "testUser";

  const res = await fetch("https://kira-ai91.onrender.com/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();

  if (data.error === "NO_ENERGY") {
    alert("Energy finished!");
    return;
  }

  clicks = data.clicks;
  energy = data.energy;

  updateUI();
}

async function rechargeEnergy() {
  showAd(); // Adsgram

  const telegramId = "testUser";

  const res = await fetch("https://kira-ai91.onrender.com/api/recharge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telegramId })
  });

  const data = await res.json();
  energy = data.energy;

  updateUI();
}

initUser();
