import styles from './SummaryCards.module.css';

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚌', Books: '📚',
  Stationery: '✏️', Entertainment: '🎮', Health: '💊',
  General: '📦', Other: '📦',
};

const fmt = (n) => '$' + parseFloat(n || 0).toFixed(2);

export default function SummaryCards({ expenses }) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  const catMap = {};
  expenses.forEach((e) => {
    catMap[e.category] = (catMap[e.category] || 0) + parseFloat(e.amount);
  });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Total Spent</span>
        <span className={styles.value}>{fmt(total)}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Transactions</span>
        <span className={styles.value}>{expenses.length}</span>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Top Category</span>
        <span className={styles.value}>
          {topCat
            ? `${CATEGORY_ICONS[topCat[0]] || '📦'} ${topCat[0]}`
            : '—'}
        </span>
      </div>
    </div>
  );
}
