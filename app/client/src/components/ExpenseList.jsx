import { useState } from 'react';
import ExpenseItem from './ExpenseItem';
import styles from './ExpenseList.module.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = expenses.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.note && e.note.toLowerCase().includes(q))
    );
  });

  return (
    <div className="card">
      <div className={styles.header}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>All Expenses</h2>
        <input
          className={styles.search}
          type="text"
          placeholder="🔍 Search expenses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🧾</span>
          {search ? 'No expenses match your search.' : 'No expenses yet. Add your first one above!'}
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
