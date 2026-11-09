import {usePluginData} from '@docusaurus/useGlobalData';
import DocCardList from '@theme/DocCardList';

function firstLink(item) {
  if (item.type === 'link') return item.href;
  return item.items.map(firstLink).find(Boolean);
}

export default function SpaceOverview({space}) {
  const {sidebar} = usePluginData('library-navigation');
  const root = space ? sidebar.find((item) => item.label === space) : null;
  const entries = space ? root?.items || [] : sidebar;
  const items = entries
    .map((item) => ({type: 'link', label: item.label, href: firstLink(item)}))
    .filter((item) => item.href);
  return <DocCardList items={items} />;
}
