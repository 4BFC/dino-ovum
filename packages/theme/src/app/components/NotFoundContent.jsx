import Translate from '@docusaurus/Translate';
import StatusPage from './StatusPage.jsx';

export default function NotFoundContent({className}) {
  return (
    <StatusPage
      className={className}
      title={<Translate id="theme.NotFound.title">Page Not Found</Translate>}
      description={
        <>
          <p>
            <Translate id="theme.NotFound.p1">We could not find what you were looking for.</Translate>
          </p>
          <p>
            <Translate id="theme.NotFound.p2">
              Please contact the owner of the site that linked you to the original URL and let them
              know their link is broken.
            </Translate>
          </p>
        </>
      }
    />
  );
}
