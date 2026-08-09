const Expense = require('../models/expenseModel');

// ──────────────────────────────────────────
//  GET /expenses  —  list all expenses
// ──────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const expenses = await Expense.getAllExpenses();
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ──────────────────────────────────────────
//  GET /expenses/:id  —  get one expense
// ──────────────────────────────────────────
const getOne = async (req, res) => {
  try {
    const expense = await Expense.getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ──────────────────────────────────────────
//  POST /expenses  —  add a new expense
// ──────────────────────────────────────────
const create = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    // Basic validation
    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: 'title and amount are required.',
      });
    }

    const expense = await Expense.createExpense({ title, amount, category, date, note });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ──────────────────────────────────────────
//  PUT /expenses/:id  —  update an expense
// ──────────────────────────────────────────
const update = async (req, res) => {
  try {
    const existing = await Expense.getExpenseById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    // Merge incoming fields with existing values so partial updates work
    const updated = await Expense.updateExpense(req.params.id, {
      title:    req.body.title    ?? existing.title,
      amount:   req.body.amount   ?? existing.amount,
      category: req.body.category ?? existing.category,
      date:     req.body.date     ?? existing.date,
      note:     req.body.note     ?? existing.note,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ──────────────────────────────────────────
//  DELETE /expenses/:id  —  delete an expense
// ──────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const deleted = await Expense.deleteExpense(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Expense not found.' });
    }
    res.status(200).json({
      success: true,
      message: `Expense "${deleted.title}" deleted successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ──────────────────────────────────────────
//  GET /expenses/summary  —  spending overview
// ──────────────────────────────────────────
const summary = async (req, res) => {
  try {
    const data = await Expense.getSummary();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove, summary };
