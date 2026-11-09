import styles from '../../styles/components/ui/FilterChip.module.scss';

export default function FilterChip({active, onClick, children}) {
  return (
    <button
      type="button"
      className={styles.chip}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
