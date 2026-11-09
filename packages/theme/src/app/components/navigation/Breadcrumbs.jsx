import styles from '../../styles/components/navigation/Breadcrumbs.module.scss';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import OriginalDocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import StructuredData from '@theme/DocBreadcrumbs/StructuredData';
import {documentBreadcrumbs} from '../../logic/document-breadcrumbs.js';
import {translate} from '@docusaurus/Translate';

export default function DocBreadcrumbs() {
  const {pathname} = useLocation();
  const {documentEntries, categoryLabels} = usePluginData('library-navigation');
  const items = documentBreadcrumbs(documentEntries, pathname, categoryLabels);
  if (!items) return <OriginalDocBreadcrumbs />;
  return (
    <>
      <StructuredData
        breadcrumbs={items.filter((item) => item.href).map((item) => ({...item, type: 'link'}))}
      />
      <nav
        aria-label={translate({id: 'docnest.breadcrumbs', message: 'Breadcrumbs'})}
        className={`theme-doc-breadcrumbs ${styles.breadcrumbs}`}
      >
        <ul className="breadcrumbs">
          <HomeBreadcrumbItem />
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li
                key={index}
                className={`breadcrumbs__item${last ? ' breadcrumbs__item--active' : ''}`}
                aria-current={last ? 'page' : undefined}
              >
                {!last && item.href ? (
                  <Link
                    to={item.href}
                    className="breadcrumbs__link"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumbs__link">{item.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
