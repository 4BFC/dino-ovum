import clsx from 'clsx';
import styles from '../../styles/components/ui/TopicBadge.module.scss';

export default function TopicBadge({children, tone = 0, title, className}) {
  return (
    <span
      className={clsx(styles.badge, className)}
      data-tone={tone}
      title={title}
    >
      {children}
    </span>
  );
}
