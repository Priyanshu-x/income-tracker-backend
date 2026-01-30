const mongoose = require("mongoose");

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
    userId: { type: String, required: true, index: true },
});

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
