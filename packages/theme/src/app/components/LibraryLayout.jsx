import BackToTopButton from '@theme/BackToTopButton';
import {useSidebarVisibility} from '../providers/SidebarVisibility.jsx';
import LibraryNavigation from './navigation/LibraryNavigation.jsx';
import styles from '../styles/components/LibraryLayout.module.scss';
import {translate} from '@docusaurus/Translate';

export default function LibraryLayout({children, lang}) {
  const {collapsed} = useSidebarVisibility();
  return (
    <div
      className={styles.layout}
      data-collapsed={collapsed}
    >
      <BackToTopButton />
      <aside
        className={styles.sidebar}
        inert={collapsed}
        aria-hidden={collapsed || undefined}
      >
        <nav
          id="doc-library-navigation"
          className={`menu thin-scrollbar ${styles.navigation}`}
          aria-label={translate({id: 'docnest.navigation', message: 'Library navigation'})}
        >
          <LibraryNavigation />
        </nav>
      </aside>
      <main
        className={styles.main}
        lang={lang}
      >
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
