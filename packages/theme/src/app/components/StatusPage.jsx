import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useThemeConfig} from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import {SITE_ROUTES} from '../routes.js';
import styles from '../styles/components/StatusPage.module.scss';

// Shared frame for the error and not-found pages: site logo, title, and the home action.
export default function StatusPage({className, title, description, actions, children}) {
  const {
    navbar: {logo},
  } = useThemeConfig();
  const light = useBaseUrl(logo?.src ?? '');
  const dark = useBaseUrl(logo?.srcDark ?? logo?.src ?? '');
  const home = useBaseUrl(SITE_ROUTES.home);

  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className={styles.content}>
        <div className={styles.heading}>
          {logo?.src && (
            <ThemedImage
              className={styles.logo}
              alt=""
              width={96}
              height={96}
              sources={{light, dark}}
            />
          )}
          <Heading
            as="h1"
            className={styles.title}
          >
            {title}
          </Heading>
        </div>
        {description}
        <div className={styles.actions}>
          {actions}
          {/* A full page load leaves a broken client state behind. */}
          <a
            className="button button--secondary button--outline"
            href={home}
          >
            <Translate id="docnest.error.home">Back home</Translate>
          </a>
        </div>
        {children}
      </div>
    </main>
  );
}
