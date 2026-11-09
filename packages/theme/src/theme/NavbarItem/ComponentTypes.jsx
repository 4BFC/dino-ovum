import ComponentTypes from '@theme-init/NavbarItem/ComponentTypes';
import SidebarToggle from '../../app/components/navigation/SidebarToggle.jsx';
import RecentUpdatesLink from '../../app/components/navigation/RecentUpdatesLink.jsx';
import LanguageDropdown from '../../app/components/navigation/LanguageDropdown.jsx';

export default {
  ...ComponentTypes,
  'custom-sidebarToggle': SidebarToggle,
  'custom-recentUpdates': RecentUpdatesLink,
  'custom-languageDropdown': LanguageDropdown,
};
