const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["income", "expense"], required: true },
    instrument: { type: String },
    lotSize: { type: String },
    buyingPrice: { type: Number },
    sellingPrice: { type: Number },
    entryTime: { type: String },
    exitTime: { type: String },
    tax: { type: Number, default: 0 },
    ruleFollowed: { type: Boolean, default: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
