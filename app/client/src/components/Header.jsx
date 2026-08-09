import styles from './Header.module.css';

export default function Header({ total }) {
  const fmt = (n) => '$' + parseFloat(n || 0).toFixed(2);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.icon}>💰</span>
          <h1 className={styles.title}>Student Expenses Tracker</h1>
        </div>
        <div className={styles.badge}>
          Total: <strong>{fmt(total)}</strong>
        </div>
      </div>
    </header>
  );
}
