import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import {directoryDocuments} from '../logic/document-list.js';
import {pagination, viewportPageSize} from '../logic/pagination.js';

export default function useDocumentTable(directory) {
  const {documentEntries} = usePluginData('library-navigation');
  const {pathname, search, hash} = useLocation();
  const history = useHistory();
  const documents = useMemo(
    () => directoryDocuments(documentEntries, directory, pathname),
    [documentEntries, directory, pathname],
  );
  const tableAreaRef = useRef(null);
  const headRef = useRef(null);
  const firstRowRef = useRef(null);
  const [pageSize, setPageSize] = useState(1);
  const [measured, setMeasured] = useState(false);
  const requestedPage = new URLSearchParams(search).get('page') || '1';
  const {page, pages, start, end, numbers} = pagination(documents.length, pageSize, requestedPage);

  const pageUrl = useCallback(
    (number) => {
      const params = new URLSearchParams(search);
      if (number === 1) params.delete('page');
      else params.set('page', String(number));
      const query = params.toString();
      return `${pathname}${query ? `?${query}` : ''}${hash}`;
    },
    [pathname, search, hash],
  );

  useEffect(() => {
    const area = tableAreaRef.current;
    function measure() {
      const rowHeight = firstRowRef.current?.getBoundingClientRect().height || 44;
      setPageSize(
        viewportPageSize(
          area.clientHeight,
          headRef.current?.getBoundingClientRect().height || 0,
          rowHeight,
        ),
      );
      setMeasured(true);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    if (headRef.current) observer.observe(headRef.current);
    if (firstRowRef.current) observer.observe(firstRowRef.current);
    measure();
    return () => observer.disconnect();
  }, [documents.length, page]);

  useEffect(() => {
    if (measured && String(page) !== requestedPage) history.replace(pageUrl(page));
  }, [measured, page, requestedPage, pageUrl, history]);

  return {documents, page, pages, start, end, numbers, pageUrl, tableAreaRef, headRef, firstRowRef};
}
