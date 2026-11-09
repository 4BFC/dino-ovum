import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';

export default function HomeHeading() {
  const {
    siteConfig: {title, customFields},
  } = useDocusaurusContext();
  const {
    navbar: {logo},
  } = useThemeConfig();
  const light = useBaseUrl(logo?.src ?? '');
  const dark = useBaseUrl(logo?.srcDark ?? logo?.src ?? '');
  return (
    <header className="library-home__heading">
      {logo?.src && (
        <ThemedImage
          className="library-home__logo"
          alt=""
          width={72}
          height={72}
          sources={{light, dark}}
        />
      )}
      <div className="library-home__titleline">
        <h1>{title}</h1>
        {customFields.version && (
          <span className="library-home__version">v.{customFields.version}</span>
        )}
      </div>
    </header>
  );
}
