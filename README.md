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
- Record income and expenses
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
(To be detailed as endpoints are implemented)

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/income`: Get all income entries for the authenticated user
- `POST /api/income`: Add a new income entry
- `GET /api/expenses`: Get all expense entries for the authenticated user
- `POST /api/expenses`: Add a new expense entry
- `GET /api/summary`: Get financial summary