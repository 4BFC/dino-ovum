import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import styles from '../styles/components/DocumentPagination.module.scss';

export default function DocumentPagination({page, pages, numbers, pageUrl}) {
  return (
    <nav
      className={styles['library-pagination']}
      aria-label={translate({id: 'docnest.pagination', message: 'Document pages'})}
    >
      {page === 1 ? (
        <button
          type="button"
          disabled
          aria-label={translate({id: 'docnest.pagination.previous', message: 'Previous page'})}
        >
          ‹
        </button>
      ) : (
        <Link
          to={pageUrl(page - 1)}
          aria-label={translate({id: 'docnest.pagination.previous', message: 'Previous page'})}
        >
          ‹
        </Link>
      )}
      {numbers.map((number) => (
        <Link
          key={number}
          to={pageUrl(number)}
          aria-label={translate(
            {id: 'docnest.pagination.page', message: 'Page {number}'},
            {number},
          )}
          aria-current={page === number ? 'page' : undefined}
        >
          {number}
        </Link>
      ))}
      {page === pages ? (
        <button
          type="button"
          disabled
          aria-label={translate({id: 'docnest.pagination.next', message: 'Next page'})}
        >
          ›
        </button>
      ) : (
        <Link
          to={pageUrl(page + 1)}
          aria-label={translate({id: 'docnest.pagination.next', message: 'Next page'})}
        >
          ›
        </Link>
      )}
    </nav>
  );
}
