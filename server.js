const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/trades", require("./routes/trades"));
app.use("/api/journal-entries", require("./routes/journalEntries"));

app.get("/", (req, res) => {
  res.json({ message: "Backend is running! Use /api/transactions for data." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});