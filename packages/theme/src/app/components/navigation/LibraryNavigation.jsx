import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import DocSidebarItems from '@theme/DocSidebarItems';

export default function LibraryNavigation({onNavigate}) {
  const {sidebar} = usePluginData('library-navigation');
  const {pathname} = useLocation();
  return (
    <ul className="menu__list">
      <DocSidebarItems
        items={sidebar}
        activePath={pathname}
        level={1}
        onItemClick={(item) => {
          if (item.type === 'link' || item.href) onNavigate?.();
        }}
      />
    </ul>
  );
}
