import { useState, useEffect, useCallback } from 'react';
import * as api from './api/expenses';

import Header        from './components/Header';
import SummaryCards  from './components/SummaryCards';
import ExpenseForm   from './components/ExpenseForm';
import ExpenseList   from './components/ExpenseList';
import EditModal     from './components/EditModal';
import Toast         from './components/Toast';

import styles from './App.module.css';

export default function App() {
  const [expenses,  setExpenses]  = useState([]);
  const [editing,   setEditing]   = useState(null);   // expense being edited
  const [toast,     setToast]     = useState({ msg: '', type: 'success' });
  const [error,     setError]     = useState('');

  const notify = (msg, type = 'success') => setToast({ msg, type });

  // ── Load all expenses from API ──────────────────────
  const loadExpenses = useCallback(async () => {
    try {
      const json = await api.getAll();
      setExpenses(json.data || []);
      setError('');
    } catch {
      setError('⚠️ Could not connect to the backend. Make sure the server is running on port 3000.');
    }
  }, []);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  // ── Add expense ─────────────────────────────────────
  const handleAdd = async (data) => {
    try {
      await api.create(data);
      notify('✅ Expense added!');
      loadExpenses();
    } catch (err) {
      notify('❌ ' + err.message, 'error');
    }
  };

  // ── Update expense ──────────────────────────────────
  const handleUpdate = async (id, data) => {
    try {
      await api.update(id, data);
      notify('✅ Expense updated!');
      loadExpenses();
    } catch (err) {
      notify('❌ ' + err.message, 'error');
    }
  };

  // ── Delete expense ──────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.remove(id);
      notify('🗑️ Expense deleted.');
      loadExpenses();
    } catch (err) {
      notify('❌ ' + err.message, 'error');
    }
  };

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <>
      <Header total={total} />

      <main className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        <SummaryCards expenses={expenses} />
        <ExpenseForm  onAdd={handleAdd} />
        <ExpenseList
          expenses={expenses}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </main>

      <EditModal
        expense={editing}
        onSave={handleUpdate}
        onClose={() => setEditing(null)}
      />

      <Toast
        message={toast.msg}
        type={toast.type}
        onDismiss={() => setToast({ msg: '', type: 'success' })}
      />
    </>
  );
}
