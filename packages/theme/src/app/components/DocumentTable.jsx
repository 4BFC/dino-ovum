import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import TopicBadge from './ui/TopicBadge.jsx';
import DocumentDate from './ui/DocumentDate.jsx';
import DocumentPagination from './DocumentPagination.jsx';
import {documentTaxonomy} from '../logic/document-taxonomy.js';
import useDocumentTable from '../hooks/useDocumentTable.js';
import styles from '../styles/components/DocumentTable.module.scss';

export default function DocumentTable({directory, fill = false}) {
  const {documents, page, pages, start, end, numbers, pageUrl, tableAreaRef, headRef, firstRowRef} =
    useDocumentTable(directory);

  return (
    <section
      className={clsx(
        styles['library-document-list'],
        fill && styles['library-document-list--fill'],
      )}
      aria-label={translate(
        {id: 'docnest.documents.in', message: 'Documents in {directory}'},
        {directory},
      )}
    >
      <div className={styles['library-document-list__toolbar']}>
        <h2>
          {translate({id: 'docnest.all', message: 'All'})} <span>{documents.length}</span>
        </h2>
        <span role="status">
          {documents.length
            ? translate(
                {id: 'docnest.documents.count', message: '{start}–{end} of {total}'},
                {start: start + 1, end, total: documents.length},
              )
            : translate({id: 'docnest.documents.empty', message: 'No documents'})}
        </span>
      </div>
      <div
        className={styles['library-document-list__table-area']}
        ref={tableAreaRef}
      >
        <table className={styles['library-document-table']}>
          <caption className={styles['library-document-table__caption']}>
            {translate(
              {id: 'docnest.documents.caption', message: 'All documents in {directory}'},
              {directory},
            )}
          </caption>
          <thead ref={headRef}>
            <tr>
              <th scope="col">{translate({id: 'docnest.document', message: 'Document'})}</th>
              <th
                scope="col"
                className={styles['library-document-table__directory']}
              >
                {translate({id: 'docnest.category', message: 'Category'})}
              </th>
              <th
                scope="col"
                className={styles['library-document-table__updated']}
              >
                {translate({id: 'docnest.updated', message: 'Updated'})}
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.slice(start, end).map((doc, index) => {
              const {category, topic, tone} = documentTaxonomy(doc.directory);
              return (
                <tr
                  key={doc.href}
                  ref={index === 0 ? firstRowRef : undefined}
                >
                  <td>
                    <Link
                      to={doc.href}
                      className={styles['library-document-table__link']}
                      title={doc.title}
                    >
                      <span className={styles['library-document-table__title-line']}>
                        <span className={styles['library-document-table__title']}>{doc.title}</span>
                        <TopicBadge
                          className={styles['library-document-table__badge']}
                          tone={tone}
                          title={doc.directory}
                        >
                          {topic}
                        </TopicBadge>
                      </span>
                      <small className={styles['library-document-table__mobile-directory']}>
                        {category}
                      </small>
                    </Link>
                  </td>
                  <td className={styles['library-document-table__directory']}>
                    <span>{category}</span>
                  </td>
                  <td className={styles['library-document-table__updated']}>
                    <DocumentDate value={doc.updated} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <DocumentPagination
        page={page}
        pages={pages}
        numbers={numbers}
        pageUrl={pageUrl}
      />
    </section>
  );
}
