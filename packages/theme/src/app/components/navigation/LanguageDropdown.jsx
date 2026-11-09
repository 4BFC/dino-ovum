import {useEffect, useId, useRef, useState} from 'react';
import {useHistorySelector} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import IconLanguage from '@theme/Icon/Language';
import controls from '../../styles/components/navigation/NavigationControls.module.scss';
import styles from '../../styles/components/navigation/LanguageDropdown.module.scss';

export default function LanguageDropdown({mobile = false}) {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const {createUrl} = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const button = useRef(null);
  const id = useId();
  const label = translate({id: 'docnest.language.label', message: 'Change language'});

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
    };
  }, [open]);

  // The same control remains in the top bar at every viewport size.
  if (mobile) return null;

  return (
    <div
      className={styles.dropdown}
      ref={root}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        className={`clean-btn ${controls.control} ${styles.trigger}`}
        title={label}
        aria-label={`${label}: ${localeConfigs[currentLocale].label}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => root.current?.querySelector('a')?.focus());
          }
        }}
      >
        <IconLanguage
          width={20}
          height={20}
          aria-hidden="true"
        />
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          aria-hidden="true"
        >
          <path
            d="m1 2.5 3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
      <ul
        id={id}
        className={styles.options}
        hidden={!open}
        aria-label={label}
      >
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={`${createUrl({locale, fullyQualified: false})}${search}${hash}`}
              lang={localeConfigs[locale].htmlLang}
              hrefLang={localeConfigs[locale].htmlLang}
              aria-current={locale === currentLocale ? 'true' : undefined}
            >
              <span>{localeConfigs[locale].label}</span>
              {locale === currentLocale && <span aria-hidden="true">✓</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
