import AppProviders from './providers/AppProviders.jsx';

export default function Root({children}) {
  return <AppProviders>{children}</AppProviders>;
}
