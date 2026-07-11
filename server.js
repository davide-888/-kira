const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Modello utente
const User = mongoose.model("User", {
  telegramId: String,
  clicks: Number,
  energy: Number,
  wallet: String
});

// Inizializza utente
app.post("/api/init", async (req, res) => {
  const { telegramId } = req.body;

  let user = await User.findOne({ telegramId });

  if (!user) {
    user = await User.create({
      telegramId,
      clicks: 0,
      energy: 200,
      wallet: null
    });
  }

  res.json(user);
});

// Click
app.post("/api/click", async (req, res) => {
  const { telegramId } = req.body;

  const user = await User.findOne({ telegramId });

  if (!user) return res.json({ error: "User not found" });

  if (user.energy <= 0) {
    return res.json({ error: "NO_ENERGY" });
  }

  user.clicks += 1;
  user.energy -= 1;

  await user.save();

  res.json({ clicks: user.clicks, energy: user.energy });
});

// Ricarica energia
app.post("/api/recharge", async (req, res) => {
  const { telegramId } = req.body;

  const user = await User.findOne({ telegramId });

  user.energy = 200;
  await user.save();

  res.json({ ok: true, energy: 200 });
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  const users = await User.find().sort({ clicks: -1 }).limit(100);
  res.json(users);
});

// Salva wallet
app.post("/api/saveWallet", async (req, res) => {
  const { telegramId, wallet } = req.body;

  await User.updateOne(
    { telegramId },
    { $set: { wallet } }
  );

  res.json({ ok: true });
});

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
