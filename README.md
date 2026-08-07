# 💰 Student Expenses Tracker

A simple personal full-stack expenses tracker for students.
**React + Vite** · **Node.js + Express** · **PostgreSQL**

---

## 📁 Folder Structure

```
student-expenses-tracker/
│
├── client/                          # Frontend — React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── expenses.js          # All API fetch calls
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseItem.jsx
│   │   │   ├── EditModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js               # Proxies /expenses → port 3000
│   └── package.json
│
└── server/                          # Backend — Node.js + Express
    ├── db/
    │   └── init.sql                 # Creates table + seeds sample data
    ├── src/
    │   ├── config/
    │   │   └── db.js                # PostgreSQL connection pool
    │   ├── controllers/
    │   │   └── expenseController.js
    │   ├── models/
    │   │   └── expenseModel.js      # SQL queries
    │   └── routes/
    │       └── expenseRoutes.js
    ├── .env.example
    ├── package.json
    └── server.js
```

---

## ⚙️ Setup

### 1. PostgreSQL — Create the database

```bash
psql -U your_username -c "CREATE DATABASE expenses_tracker;"
psql -U your_username -d expenses_tracker -f server/db/init.sql
```

### 2. Environment variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=expenses_tracker
PORT=3000
```

### 3. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

---

## 🚀 Running the App

Open two terminals:

```bash
# Terminal 1 — Backend (port 3000)
cd server
node server.js

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| GET    | /expenses          | Get all expenses (newest first)     |
| GET    | /expenses/summary  | Total spent + breakdown by category |
| GET    | /expenses/:id      | Get a single expense by ID          |
| POST   | /expenses          | Add a new expense                   |
| PUT    | /expenses/:id      | Update an existing expense          |
| DELETE | /expenses/:id      | Delete an expense                   |

---

## 📦 Request Body (POST / PUT)

```json
{
  "title":    "Lunch at cafeteria",
  "amount":   5.50,
  "category": "Food",
  "date":     "2026-08-07",
  "note":     "Rice and curry"
}
```

| Field    | Required | Default  | Example                    |
|----------|----------|----------|----------------------------|
| title    | Yes      | —        | "Bus fare"                 |
| amount   | Yes      | —        | 12.50                      |
| category | No       | General  | Food, Transport, Books     |
| date     | No       | Today    | 2026-08-07                 |
| note     | No       | null     | "Weekly shop"              |

---

## 🛠 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React 18 + Vite     |
| Backend   | Node.js + Express   |
| Database  | PostgreSQL          |
| DB Driver | node-postgres (pg)  |
