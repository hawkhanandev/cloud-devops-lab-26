import { useState, useEffect } from 'react';
import styles from './EditModal.module.css';

const CATEGORIES = ['General', 'Food', 'Transport', 'Books', 'Stationery', 'Entertainment', 'Health', 'Other'];

export default function EditModal({ expense, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', amount: '', category: 'General', date: '', note: '' });
  const [loading, setLoading] = useState(false);

  // Populate form when expense changes
  useEffect(() => {
    if (expense) {
      setForm({
        title:    expense.title,
        amount:   expense.amount,
        category: expense.category,
        date:     expense.date?.split('T')[0] || '',
        note:     expense.note || '',
      });
    }
  }, [expense]);

  if (!expense) return null;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(expense.id, { ...form, amount: parseFloat(form.amount) });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Edit Expense</h3>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={form.title} onChange={set('title')} required />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" step="0.01" min="0.01" value={form.amount} onChange={set('amount')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={set('date')} />
            </div>
          </div>

          <div className="form-group">
            <label>Note</label>
            <input type="text" value={form.note} onChange={set('note')} />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.save} disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
