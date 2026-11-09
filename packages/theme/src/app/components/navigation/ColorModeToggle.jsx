import {useEffect, useRef} from 'react';
import styles from '../../styles/components/navigation/NavigationControls.module.scss';
import {flushSync} from 'react-dom';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode} from '@docusaurus/theme-common';
import IconLightMode from '@theme/Icon/LightMode';
import IconDarkMode from '@theme/Icon/DarkMode';
import {translate} from '@docusaurus/Translate';

export default function ColorModeToggle({className, buttonClassName, onChange}) {
  const {colorMode} = useColorMode();
  const isBrowser = useIsBrowser();
  const transitionRef = useRef(null);
  const label =
    colorMode === 'dark'
      ? translate({id: 'docnest.theme.light', message: 'Switch to light mode'})
      : translate({id: 'docnest.theme.dark', message: 'Switch to dark mode'});

  useEffect(() => () => transitionRef.current?.skipTransition(), []);

  function toggleTheme() {
    transitionRef.current?.skipTransition();
    // Read at update time so rapid clicks still alternate correctly.
    const updateTheme = () =>
      onChange(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      updateTheme();
      return;
    }

    const transition = document.startViewTransition(() => flushSync(updateTheme));
    transitionRef.current = transition;
    // Skipping an interrupted transition rejects ready, but still applies its update.
    transition.ready.catch(() => {});
    const clearTransition = () => {
      if (transitionRef.current === transition) transitionRef.current = null;
    };
    transition.finished.then(clearTransition, clearTransition);
  }

  return (
    <div className={`${styles['theme-toggle']} ${className ?? ''}`}>
      <button
        type="button"
        className={`library-theme-toggle clean-btn ${styles.control} ${buttonClassName ?? ''}`}
        aria-label={label}
        title={label}
        disabled={!isBrowser}
        onClick={toggleTheme}
      >
        <IconLightMode
          className={styles['light-icon']}
          aria-hidden="true"
        />
        <IconDarkMode
          className={styles['dark-icon']}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
