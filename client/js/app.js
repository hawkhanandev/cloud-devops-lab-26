// ── Config ─────────────────────────────────────────────
const API_BASE = 'http://localhost:3000/expenses';

// ── Category emoji map ──────────────────────────────────
const CATEGORY_ICONS = {
  Food:          '🍔',
  Transport:     '🚌',
  Books:         '📚',
  Stationery:    '✏️',
  Entertainment: '🎮',
  Health:        '💊',
  General:       '📦',
  Other:         '📦',
};

// ── State ───────────────────────────────────────────────
let allExpenses = [];

// ── DOM Refs ────────────────────────────────────────────
const expenseForm  = document.getElementById('expense-form');
const editForm     = document.getElementById('edit-form');
const expensesList = document.getElementById('expenses-list');
const editModal    = document.getElementById('edit-modal');
const searchInput  = document.getElementById('search');
const totalBadge   = document.getElementById('total-badge');
const toast        = document.getElementById('toast');

// ── Utilities ───────────────────────────────────────────
const fmt = (n) => '$' + parseFloat(n).toFixed(2);

const fmtDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className   = `toast ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
}

// ── Fetch all expenses ──────────────────────────────────
async function loadExpenses() {
  try {
    const res  = await fetch(API_BASE);
    const json = await res.json();
    allExpenses = json.data || [];
    renderExpenses(allExpenses);
    updateSummary(allExpenses);
  } catch {
    expensesList.innerHTML = `<div class="empty-state">⚠️ Could not connect to server.<br>Make sure the API is running on port 3000.</div>`;
  }
}

// ── Render expense list ─────────────────────────────────
function renderExpenses(expenses) {
  if (!expenses.length) {
    expensesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧾</div>
        No expenses yet. Add your first one above!
      </div>`;
    return;
  }

  expensesList.innerHTML = expenses.map(e => `
    <div class="expense-item" data-id="${e.id}">
      <div class="expense-icon">${CATEGORY_ICONS[e.category] || '📦'}</div>
      <div class="expense-body">
        <div class="expense-title">${escHtml(e.title)}</div>
        <div class="expense-meta">
          <span class="category-tag">${escHtml(e.category)}</span>
          &nbsp;·&nbsp; ${fmtDate(e.date)}
          ${e.note ? `&nbsp;·&nbsp; <em>${escHtml(e.note)}</em>` : ''}
        </div>
      </div>
      <div class="expense-amount">${fmt(e.amount)}</div>
      <div class="expense-actions">
        <button class="icon-btn edit-btn"  data-id="${e.id}" title="Edit">✏️</button>
        <button class="icon-btn delete delete-btn" data-id="${e.id}" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');

  // Attach action listeners
  document.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => openEditModal(btn.dataset.id))
  );
  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteExpense(btn.dataset.id))
  );
}

// ── Update summary stats ────────────────────────────────
function updateSummary(expenses) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  // Top category
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + parseFloat(e.amount); });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('stat-total').textContent = fmt(total);
  document.getElementById('stat-count').textContent  = expenses.length;
  document.getElementById('stat-top').textContent    = topCat ? `${CATEGORY_ICONS[topCat[0]] || ''} ${topCat[0]}` : '—';
  totalBadge.textContent = `Total: ${fmt(total)}`;
}

// ── Add new expense ─────────────────────────────────────
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>Adding...</span>';

  const body = {
    title:    document.getElementById('title').value.trim(),
    amount:   parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    date:     document.getElementById('date').value || new Date().toISOString().split('T')[0],
    note:     document.getElementById('note').value.trim() || null,
  };

  try {
    const res = await fetch(API_BASE, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      expenseForm.reset();
      showToast('✅ Expense added!');
      loadExpenses();
    } else {
      showToast('❌ ' + json.message, 'error');
    }
  } catch {
    showToast('❌ Server error. Is the API running?', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>+ Add Expense</span>';
  }
});

// ── Open edit modal ─────────────────────────────────────
function openEditModal(id) {
  const expense = allExpenses.find(e => String(e.id) === String(id));
  if (!expense) return;

  document.getElementById('edit-id').value       = expense.id;
  document.getElementById('edit-title').value    = expense.title;
  document.getElementById('edit-amount').value   = expense.amount;
  document.getElementById('edit-category').value = expense.category;
  document.getElementById('edit-date').value     = expense.date?.split('T')[0] || '';
  document.getElementById('edit-note').value     = expense.note || '';

  editModal.classList.remove('hidden');
}

// ── Close modal ─────────────────────────────────────────
document.getElementById('close-modal').addEventListener('click', () => editModal.classList.add('hidden'));
document.getElementById('cancel-edit').addEventListener('click', () => editModal.classList.add('hidden'));
editModal.addEventListener('click', (e) => { if (e.target === editModal) editModal.classList.add('hidden'); });

// ── Submit edit ─────────────────────────────────────────
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;

  const body = {
    title:    document.getElementById('edit-title').value.trim(),
    amount:   parseFloat(document.getElementById('edit-amount').value),
    category: document.getElementById('edit-category').value,
    date:     document.getElementById('edit-date').value,
    note:     document.getElementById('edit-note').value.trim() || null,
  };

  try {
    const res  = await fetch(`${API_BASE}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) {
      editModal.classList.add('hidden');
      showToast('✅ Expense updated!');
      loadExpenses();
    } else {
      showToast('❌ ' + json.message, 'error');
    }
  } catch {
    showToast('❌ Server error.', 'error');
  }
});

// ── Delete expense ──────────────────────────────────────
async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    const res  = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('🗑️ Expense deleted.');
      loadExpenses();
    } else {
      showToast('❌ ' + json.message, 'error');
    }
  } catch {
    showToast('❌ Server error.', 'error');
  }
}

// ── Live search ─────────────────────────────────────────
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allExpenses.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q) ||
    (e.note && e.note.toLowerCase().includes(q))
  );
  renderExpenses(filtered);
});

// ── Escape HTML helper ──────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Set default date to today ───────────────────────────
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// ── Init ────────────────────────────────────────────────
loadExpenses();
