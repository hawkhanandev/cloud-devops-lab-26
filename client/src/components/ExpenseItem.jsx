import styles from './ExpenseItem.module.css';

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Books: '📚',
  Stationery: '✏️', Entertainment: '🎮', Health: '💊',
  General: '📦', Other: '📦',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const { id, title, amount, category, date, note } = expense;

  return (
    <div className={styles.item}>
      <div className={styles.icon}>{CATEGORY_ICONS[category] || '📦'}</div>

      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          <span className={styles.tag}>{category}</span>
          &nbsp;·&nbsp;{fmtDate(date)}
          {note && <>&nbsp;·&nbsp;<em>{note}</em></>}
        </div>
      </div>

      <div className={styles.amount}>${parseFloat(amount).toFixed(2)}</div>

      <div className={styles.actions}>
        <button className="icon-btn" onClick={() => onEdit(expense)} title="Edit">✏️</button>
        <button className="icon-btn delete" onClick={() => onDelete(id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
}
