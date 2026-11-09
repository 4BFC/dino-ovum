import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import OriginalDocCardList from '@theme-init/DocCardList';
import DocumentTable from '../../app/components/DocumentTable.jsx';
import {findDocumentByRoute} from '../../app/logic/document-list.js';

export default function DocCardList(props) {
  const {pathname} = useLocation();
  const {documentEntries} = usePluginData('library-navigation');
  const current = findDocumentByRoute(documentEntries, pathname);
  if (!current?.isIndex || !current.directory) return <OriginalDocCardList {...props} />;
  return (
    <DocumentTable
      key={current.directory}
      directory={current.directory}
    />
  );
}
