# Student Expenses Tracker

A simple personal full-stack expenses tracker for students.
Built with Node.js + Express + PostgreSQL on the backend and plain HTML/CSS/JS on the frontend.

---

## Folder Structure

```
student-expenses-tracker/
│
├── client/                        # Frontend (HTML + CSS + JS)
│   ├── index.html                 # Main UI page
│   ├── css/
│   │   └── style.css              # All styles (dark theme)
│   └── js/
│       └── app.js                 # Fetches API, renders UI
│
├── server/                        # Backend (Node.js + Express + PostgreSQL)
│   ├── db/
│   │   └── init.sql               # Creates expenses table + seed data
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   └── expenseController.js  # Request / response logic
│   │   ├── models/
│   │   │   └── expenseModel.js    # Raw SQL queries (CRUD + summary)
│   │   └── routes/
│   │       └── expenseRoutes.js   # URL routing
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── server.js                  # Express entry point
│
├── package.json                   # Root scripts
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Set up your .env file

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=expenses_tracker
PORT=3000
```

### 2. Create the PostgreSQL database

```bash
psql -U your_postgres_username -c "CREATE DATABASE expenses_tracker;"
```

### 3. Run the SQL init script (creates table + seeds sample data)

```bash
psql -U your_postgres_username -d expenses_tracker -f server/db/init.sql
```

### 4. Install server dependencies

```bash
cd server && npm install
```

### 5. Start the server

```bash
# From the server/ directory:
npm run dev        # Development (auto-restarts)
npm start          # Production
```

Open your browser at: http://localhost:3000
The server also serves the frontend from the client/ folder automatically.

---

## API Endpoints

| Method | Endpoint          | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | /api              | API info and available routes       |
| GET    | /expenses         | Get all expenses (newest first)     |
| GET    | /expenses/summary | Total spent + breakdown by category |
| GET    | /expenses/:id     | Get a single expense by ID          |
| POST   | /expenses         | Add a new expense                   |
| PUT    | /expenses/:id     | Update an existing expense          |
| DELETE | /expenses/:id     | Delete an expense                   |

---

## Request Body (POST / PUT)

```json
{
  "title":    "Lunch at cafeteria",
  "amount":   5.50,
  "category": "Food",
  "date":     "2026-08-07",
  "note":     "Rice and curry"
}
```

| Field    | Required | Default      | Example values              |
|----------|----------|--------------|-----------------------------|
| title    | Yes      | -            | "Bus fare"                  |
| amount   | Yes      | -            | 12.50                       |
| category | No       | General      | Food, Transport, Books      |
| date     | No       | Today        | 2026-08-07                  |
| note     | No       | null         | "Weekly shop"               |

---

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | HTML / CSS / JS     |
| Backend   | Node.js + Express   |
| Database  | PostgreSQL          |
| DB Driver | node-postgres (pg)  |
| Dev Tool  | nodemon             |
