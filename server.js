const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
});

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
  const { date, source, amount, category, description } = req.body; // Updated to include description
  const newTransaction = new Transaction({ date, source, amount, category, description });
  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ message: "Error saving transaction", error: err });
  }
});

app.put("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const { date, source, amount, category, description } = req.body; // Updated to include description
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { date, source, amount, category, description },
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
