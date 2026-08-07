const pool = require('../config/db');

// ── Get ALL expenses (newest first) ────────────────────
const getAllExpenses = async () => {
  const result = await pool.query(
    'SELECT * FROM expenses ORDER BY date DESC, id DESC'
  );
  return result.rows;
};

// ── Get a SINGLE expense by ID ──────────────────────────
const getExpenseById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// ── Create a NEW expense ────────────────────────────────
const createExpense = async ({ title, amount, category, date, note }) => {
  const result = await pool.query(
    `INSERT INTO expenses (title, amount, category, date, note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, amount, category || 'General', date || new Date(), note || null]
  );
  return result.rows[0];
};

// ── Update an EXISTING expense ──────────────────────────
const updateExpense = async (id, { title, amount, category, date, note }) => {
  const result = await pool.query(
    `UPDATE expenses
     SET title = $1, amount = $2, category = $3, date = $4, note = $5
     WHERE id = $6
     RETURNING *`,
    [title, amount, category, date, note, id]
  );
  return result.rows[0];
};

// ── Delete an expense ───────────────────────────────────
const deleteExpense = async (id) => {
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

// ── Spending summary by category ────────────────────────
const getSummary = async () => {
  const total = await pool.query('SELECT SUM(amount) AS total FROM expenses');
  const byCategory = await pool.query(
    `SELECT category, SUM(amount) AS total, COUNT(*) AS count
     FROM expenses
     GROUP BY category
     ORDER BY total DESC`
  );
  return {
    total: parseFloat(total.rows[0].total) || 0,
    byCategory: byCategory.rows,
  };
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
};
