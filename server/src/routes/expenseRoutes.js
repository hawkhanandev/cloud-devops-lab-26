const express = require('express');
const router  = express.Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove,
  summary,
} = require('../controllers/expenseController');

// GET  /expenses/summary  ← must be ABOVE /:id so it isn't treated as an id param
router.get('/summary', summary);

// GET  /expenses
router.get('/', getAll);

// GET  /expenses/:id
router.get('/:id', getOne);

// POST /expenses
router.post('/', create);

// PUT  /expenses/:id
router.put('/:id', update);

// DELETE /expenses/:id
router.delete('/:id', remove);

module.exports = router;
