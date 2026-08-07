require('dotenv').config();
const express = require('express');
const cors = require('cors');

const expenseRoutes = require('./src/routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────
app.use('/expenses', expenseRoutes);

// ── Health check ─────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '💰 Student Expenses Tracker API is running!',
    endpoints: {
      'GET    /expenses': 'List all expenses',
      'GET    /expenses/summary': 'Spending summary by category',
      'GET    /expenses/:id': 'Get a single expense',
      'POST   /expenses': 'Add a new expense',
      'PUT    /expenses/:id': 'Update an expense',
      'DELETE /expenses/:id': 'Delete an expense',
    },
  });
});

// ── 404 handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler ─────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start server ─────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
  console.log(`📋  API docs at     http://localhost:${PORT}/`);
});
