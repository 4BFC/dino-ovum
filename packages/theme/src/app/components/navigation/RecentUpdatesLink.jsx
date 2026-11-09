import styles from '../../styles/components/navigation/NavigationControls.module.scss';
import Link from '@docusaurus/Link';
import {SITE_ROUTES} from '../../routes.js';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function RecentUpdatesLink({mobile = false, onClick}) {
  const url = useBaseUrl(SITE_ROUTES.updates);
  const label = translate({id: 'docnest.updates.title', message: 'Recent Updates'});
  const link = (
    <Link
      to={url}
      className={mobile ? `menu__link ${styles['menu-link']}` : styles.control}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7" />
        <path d="M12 7v5l3 2" />
      </svg>
      {mobile && <span>{label}</span>}
    </Link>
  );
  return mobile ? <li className="menu__list-item">{link}</li> : link;
}
