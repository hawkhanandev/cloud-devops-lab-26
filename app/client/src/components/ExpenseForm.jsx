import { useState } from 'react';

const CATEGORIES = ['General', 'Food', 'Transport', 'Books', 'Stationery', 'Entertainment', 'Health', 'Other'];
const today = () => new Date().toISOString().split('T')[0];

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: '', amount: '', category: 'General', date: today(), note: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({ ...form, amount: parseFloat(form.amount) });
      setForm({ title: '', amount: '', category: 'General', date: today(), note: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title <span className="required">*</span></label>
            <input id="title" type="text" placeholder="e.g. Lunch at cafeteria"
              value={form.title} onChange={set('title')} required />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount ($) <span className="required">*</span></label>
            <input id="amount" type="number" placeholder="0.00" step="0.01" min="0.01"
              value={form.amount} onChange={set('amount')} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <input id="note" type="text" placeholder="Any extra detail..."
            value={form.note} onChange={set('note')} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding…' : '+ Add Expense'}
        </button>
      </form>
    </div>
  );
}
