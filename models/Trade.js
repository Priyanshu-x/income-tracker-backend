const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    instrument: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
});

module.exports = mongoose.model("Trade", tradeSchema);
