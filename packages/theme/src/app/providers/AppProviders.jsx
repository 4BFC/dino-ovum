import {SidebarVisibilityProvider} from './SidebarVisibility.jsx';

export default function AppProviders({children}) {
  return <SidebarVisibilityProvider>{children}</SidebarVisibilityProvider>;
}
