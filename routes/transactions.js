const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET all transactions
router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching transactions", error: err });
    }
});

// POST new transaction
router.post("/", async (req, res) => {
    const {
        date, source, amount, category, description, type,
        instrument, lotSize, buyingPrice, sellingPrice, entryTime, exitTime, tax, ruleFollowed
    } = req.body;

    // Validate amount based on type
    if (type === "expense" && amount > 0) {
        return res.status(400).json({ message: "Expense amount must be negative" });
    }
    if (type === "income" && amount < 0) {
        return res.status(400).json({ message: "Income amount must be positive" });
    }

    const newTransaction = new Transaction({
        date, source, amount, category, description, type,
        instrument, lotSize, buyingPrice, sellingPrice, entryTime, exitTime, tax, ruleFollowed
    });
    try {
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ message: "Error saving transaction", error: err });
    }
});

// PUT update transaction
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        date, source, amount, category, description, type,
        instrument, lotSize, buyingPrice, sellingPrice, entryTime, exitTime, tax, ruleFollowed
    } = req.body;

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
            {
                date, source, amount, category, description, type,
                instrument, lotSize, buyingPrice, sellingPrice, entryTime, exitTime, tax, ruleFollowed
            },
            { new: true, runValidators: true }
        );
        if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
        res.json(updatedTransaction);
    } catch (err) {
        res.status(500).json({ message: "Error updating transaction", error: err });
    }
});

// DELETE transaction
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting transaction", error: err });
    }
});

module.exports = router;
