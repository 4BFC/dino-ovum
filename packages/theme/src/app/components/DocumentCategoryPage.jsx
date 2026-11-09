import DocBreadcrumbs from './navigation/Breadcrumbs.jsx';
import Heading from '@theme/Heading';
import DocumentTable from './DocumentTable.jsx';
import styles from '../styles/components/DocumentCategoryPage.module.scss';

export default function DocumentCategoryPage({directory, title, description}) {
  return (
    <section className={styles['library-category-page']}>
      <header className={styles['library-category-page__header']}>
        <DocBreadcrumbs />
        <Heading as="h1">{title}</Heading>
        <p>{description}</p>
      </header>
      <DocumentTable
        key={directory}
        directory={directory}
        fill
      />
    </section>
  );
}
