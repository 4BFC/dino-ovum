import Translate from '@docusaurus/Translate';
import styles from '../styles/components/StatusPage.module.scss';
import StatusPage from './StatusPage.jsx';

export default function ErrorPageContent({error, tryAgain}) {
  return (
    <StatusPage
      title={<Translate id="docnest.error.title">Page Error</Translate>}
      description={
        <p>
          <Translate id="docnest.error.description">
            We couldn't display this page. Try again, or head back home.
          </Translate>
        </p>
      }
      actions={
        <button
          type="button"
          className="button button--primary"
          onClick={tryAgain}
        >
          <Translate id="docnest.error.retry">Try again</Translate>
        </button>
      }
    >
      {error && (
        <details className={styles.details}>
          <summary>
            <Translate id="docnest.error.details">Error details</Translate>
          </summary>
          <pre>{error.message}</pre>
        </details>
      )}
    </StatusPage>
  );
}
