import styles from '../../styles/components/navigation/NavigationControls.module.scss';
import {useWindowSize} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useSidebarVisibility} from '../../providers/SidebarVisibility.jsx';
import {SITE_ROUTES, isSameRoute, normalizePath} from '../../routes.js';
import {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function SidebarToggle({mobile = false}) {
  const {collapsed, setCollapsed} = useSidebarVisibility();
  const mobileSidebar = useNavbarMobileSidebar();
  const isMobile = useWindowSize() === 'mobile';
  const {pathname} = useLocation();
  const {paths} = usePluginData('library-navigation');
  const hasSidebar = paths.includes(normalizePath(pathname));
  const updatesUrl = useBaseUrl(SITE_ROUTES.updates);
  const hasUpdates = isSameRoute(pathname, updatesUrl);
  if (mobile || (!hasSidebar && !hasUpdates && !isMobile)) return null;
  const expanded = isMobile ? mobileSidebar.shown : !collapsed;
  const label = expanded
    ? translate({id: 'docnest.navigation.collapse', message: 'Collapse navigation'})
    : translate({id: 'docnest.navigation.expand', message: 'Expand navigation'});

  return (
    <button
      type="button"
      className={`library-sidebar-toggle clean-btn ${styles.control} ${styles['sidebar-toggle']}`}
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      aria-controls={isMobile ? undefined : 'doc-library-navigation'}
      onClick={() => (isMobile ? mobileSidebar.toggle() : setCollapsed((value) => !value))}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M9 4v16"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    </button>
  );
}
