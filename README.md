# Income Tracker Backend

This is the backend application for the Income Tracker project. It provides the necessary APIs to manage income and expenses.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features
- User authentication and authorization
- Record income and expenses with type (income/expense) and description
- Track trades
- Manage journal entries linked to trades
- View financial summaries
- Data persistence

## Technologies Used
- Node.js
- Express.js
- MongoDB 
- JWT for authentication

## Setup

### Prerequisites
- Node.js (LTS version recommended)
- npm (Node Package Manager)
- MongoDB instance (local or cloud-hosted)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/income-tracker-backend.git
   cd income-tracker-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
   - `PORT`: The port on which the server will run.
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A strong, random secret key for JWT token generation.
   - `NODE_ENV`: Set to `production` for deployment.

## Usage

### Running the server
To start the development server:
```bash
npm start
```
The server will run on the port specified in your `.env` file (default: `http://localhost:5000`).

## API Endpoints

### Transactions
- `GET /api/transactions`: Get all transactions.
- `POST /api/transactions`: Add a new transaction.
  - **Request Body:** `{ date: Date, source: String, amount: Number, category: String, description: String (optional), type: "income" | "expense" }`
  - **Validation:** `amount` must be positive for `income` and negative for `expense`.
- `PUT /api/transactions/:id`: Update an existing transaction.
  - **Request Body:** `{ date: Date, source: String, amount: Number, category: String, description: String (optional), type: "income" | "expense" }`
  - **Validation:** `amount` must be positive for `income` and negative for `expense`.
- `DELETE /api/transactions/:id`: Delete a transaction.

### Trades
- `POST /api/trades`: Create a new trade entry.
  - **Request Body:** `{ date: Date, instrument: String, amount: Number, description: String (optional) }`
- `GET /api/trades`: Get a list of trades.
  - **Query Parameters (optional):** `date` (e.g., `/api/trades?date=2023-10-26`) to filter by a specific day.

### Journal Entries
- `POST /api/journal-entries`: Create a new journal entry.
  - **Request Body:** `{ date: Date, title: String, content: String (optional), linkedTrades: [{ _id: ObjectId, instrument: String, amount: Number, description: String (optional) }] (optional) }`
  - **Validation:** `linkedTrades` are validated to exist for the given `date`.
- `GET /api/journal-entries`: Get all journal entries.
- `PUT /api/journal-entries/:id`: Update an existing journal entry.
  - **Request Body:** `{ date: Date, title: String, content: String (optional), linkedTrades: [{ _id: ObjectId, instrument: String, amount: Number, description: String (optional) }] (optional) }`
- `DELETE /api/journal-entries/:id`: Delete a journal entry.