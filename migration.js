const mongoose = require("mongoose");
require("dotenv").config();

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true, enum: ['income', 'expense'] },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

async function migrateTransactions() {
  try {
    await mongoose.connect('mongodb+srv://clgbca01_db_user:paZnwBbEE4tWMdfQ@income-tracker.e4nvny3.mongodb.net/?retryWrites=true&w=majority&appName=income-tracker');
    console.log('Connected to MongoDB Atlas for migration.');

    const result = await Transaction.updateMany(
      { type: { $exists: false } }, // Find transactions where 'type' field does not exist
      { $set: { type: "income" } } // Set 'type' to "income"
    );

    console.log(`Migration complete: ${result.nModified} transactions updated.`);

    // Ensure all income transactions have positive amounts
    const positiveAmountResult = await Transaction.updateMany(
      { type: "income", amount: { $lt: 0 } },
      { $mul: { amount: -1 } } // Multiply by -1 to make it positive
    );
    console.log(`Corrected ${positiveAmountResult.nModified} income transactions to have positive amounts.`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas.');
  }
}

migrateTransactions();