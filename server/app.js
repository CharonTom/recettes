require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(express.json());

// Connexion MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ MongoDB erreur:", err));

// Routes
const authRoutes = require("./routes/user");
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lancée sur http://localhost:${PORT}`));
