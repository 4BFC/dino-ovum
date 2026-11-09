import {useMemo, useState} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import {groupUpdates} from '../logic/update-groups.js';

export default function useUpdates() {
  const {entries = []} = usePluginData('recent-updates') || {};
  const [instance, setInstance] = useState('All');
  const [newOnly, setNewOnly] = useState(false);
  const [days, setDays] = useState(30);

  const instances = useMemo(
    () => ['All', ...Array.from(new Set(entries.map((e) => e.instance)))],
    [entries],
  );

  const groups = useMemo(
    () => groupUpdates(entries, {instance, newOnly, days}, Date.now()),
    [entries, instance, newOnly, days],
  );
  const total = groups.reduce((count, [, items]) => count + items.length, 0);

  return {instance, setInstance, newOnly, setNewOnly, days, setDays, instances, groups, total};
}
