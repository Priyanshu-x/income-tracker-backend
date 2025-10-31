const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running! Use /api/transactions for data." });
});

// MongoDB Connection
mongoose.connect('mongodb+srv://clgbca01_db_user:paZnwBbEE4tWMdfQ@income-tracker.e4nvny3.mongodb.net/?retryWrites=true&w=majority&appName=income-tracker')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Connection error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String }, // Added description field, not required
  type: { type: String, enum: ["income", "expense"], required: true }, // New field
});

// Trade Schema
const tradeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  instrument: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
});

const Trade = mongoose.model("Trade", tradeSchema);

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  content: { type: String },
  linkedTrades: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
      instrument: { type: String },
      amount: { type: Number },
      description: { type: String },
    },
  ],
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes (unchanged GET, POST, PUT, DELETE routes remain the same, just ensure description is included)
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err });
  }
});

app.post("/api/transactions", async (req, res) => {
  const { date, source, amount, category, description, type } = req.body; // Updated to include description and type

  // Validate amount based on type
  if (type === "expense" && amount > 0) {
    return res.status(400).json({ message: "Expense amount must be negative" });
  }
  if (type === "income" && amount < 0) {
    return res.status(400).json({ message: "Income amount must be positive" });
  }

  const newTransaction = new Transaction({ date, source, amount, category, description, type });
  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ message: "Error saving transaction", error: err });
  }
});

app.put("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const { date, source, amount, category, description, type } = req.body; // Updated to include description and type

  // Validate amount based on type if type is provided
  if (type === "expense" && amount > 0) {
    return res.status(400).json({ message: "Expense amount must be negative" });
  }
  if (type === "income" && amount < 0) {
    return res.status(400).json({ message: "Income amount must be positive" });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { date, source, amount, category, description, type },
      { new: true, runValidators: true }
    );
    if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: "Error updating transaction", error: err });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction", error: err });
  }
});

// Journal Entry Routes
app.post("/api/journal-entries", async (req, res) => {
  const { date, title, content, linkedTrades } = req.body;

  // Validate linked trades
  if (linkedTrades && linkedTrades.length > 0) {
    const tradeIds = linkedTrades.map(trade => trade._id);
    const existingTrades = await Trade.find({ _id: { $in: tradeIds }, date: new Date(date) });

    if (existingTrades.length !== tradeIds.length) {
      return res.status(400).json({ message: "One or more linked trades not found for the selected date." });
    }
  }

  const newJournalEntry = new JournalEntry({ date, title, content, linkedTrades });
  try {
    const savedJournalEntry = await newJournalEntry.save();
    res.status(201).json(savedJournalEntry);
  } catch (err) {
    res.status(500).json({ message: "Error saving journal entry", error: err });
  }
});

app.get("/api/journal-entries", async (req, res) => {
  try {
    const journalEntries = await JournalEntry.find();
    res.json(journalEntries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching journal entries", error: err });
  }
});

app.put("/api/journal-entries/:id", async (req, res) => {
  const { id } = req.params;
  const { date, title, content, linkedTrades } = req.body;

  // Validate linked trades
  if (linkedTrades && linkedTrades.length > 0) {
    const tradeIds = linkedTrades.map(trade => trade._id);
    const existingTrades = await Trade.find({ _id: { $in: tradeIds }, date: new Date(date) });

    if (existingTrades.length !== tradeIds.length) {
      return res.status(400).json({ message: "One or more linked trades not found for the selected date." });
    }
  }

  try {
    const updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
      id,
      { date, title, content, linkedTrades },
      { new: true, runValidators: true }
    );
    if (!updatedJournalEntry) return res.status(404).json({ message: "Journal entry not found" });
    res.json(updatedJournalEntry);
  } catch (err) {
    res.status(500).json({ message: "Error updating journal entry", error: err });
  }
});

app.delete("/api/journal-entries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedJournalEntry = await JournalEntry.findByIdAndDelete(id);
    if (!deletedJournalEntry) return res.status(404).json({ message: "Journal entry not found" });
    res.json({ message: "Journal entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting journal entry", error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Trade Routes
app.post("/api/trades", async (req, res) => {
  const { date, instrument, amount, description } = req.body;
  const newTrade = new Trade({ date, instrument, amount, description });
  try {
    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);
  } catch (err) {
    res.status(500).json({ message: "Error saving trade", error: err });
  }
});

app.get("/api/trades", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    const trades = await Trade.find(query);
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trades", error: err });
  }
});