import OriginalNavbarSearch from '@theme-init/Navbar/Search';
import styles from '../../../app/styles/components/navigation/NavigationControls.module.scss';

// Keep search in the header flow so its mobile absolute position cannot cover
// the adjacent Recent Updates shortcut.
export default function NavbarSearch({className, ...props}) {
  return (
    <OriginalNavbarSearch
      {...props}
      className={`${styles['search-container']} ${className ?? ''}`}
    />
  );
}
