import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import FilterChip from './ui/FilterChip.jsx';
import DocumentDate from './ui/DocumentDate.jsx';
import useUpdates from '../hooks/useUpdates.js';
import styles from '../styles/components/Updates.module.scss';

const spaceLabel = (name) =>
  name === 'All' ? translate({id: 'docnest.all', message: 'All'}) : name;

export default function Updates() {
  const {instance, setInstance, newOnly, setNewOnly, days, setDays, instances, groups, total} =
    useUpdates();

  return (
    <div className={styles.updates}>
      <h1>{translate({id: 'docnest.updates.title', message: 'Recent Updates'})}</h1>
      <p className={styles.muted}>
        {translate({
          id: 'docnest.updates.description',
          message: 'Browse new and updated documents by date and document space.',
        })}
      </p>

      <div
        role="group"
        aria-label={translate({id: 'docnest.updates.range', message: 'Date range'})}
        className={styles.filters}
      >
        {[
          {
            v: 7,
            t: translate({id: 'docnest.updates.days', message: 'Last {days} days'}, {days: 7}),
          },
          {
            v: 30,
            t: translate({id: 'docnest.updates.days', message: 'Last {days} days'}, {days: 30}),
          },
          {
            v: 90,
            t: translate({id: 'docnest.updates.days', message: 'Last {days} days'}, {days: 90}),
          },
          {v: 0, t: translate({id: 'docnest.updates.allTime', message: 'All time'})},
        ].map((o) => (
          <FilterChip
            key={o.v}
            active={days === o.v}
            onClick={() => setDays(o.v)}
          >
            {o.t}
          </FilterChip>
        ))}
      </div>

      <div
        role="group"
        aria-label={translate({id: 'docnest.updates.spaces', message: 'Document spaces'})}
        className={styles.filters}
      >
        {instances.map((name) => (
          <FilterChip
            key={name}
            active={instance === name}
            onClick={() => setInstance(name)}
          >
            {spaceLabel(name)}
          </FilterChip>
        ))}
      </div>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={newOnly}
          onChange={(e) => setNewOnly(e.target.checked)}
        />
        {translate({id: 'docnest.updates.newOnly', message: 'New documents only'})}
      </label>

      <p
        role="status"
        className={styles.summary}
      >
        {translate(
          {id: 'docnest.updates.summary', message: 'Dates: {dates}, documents: {total}'},
          {dates: groups.length, total},
        )}
      </p>

      {groups.map(([day, items]) => (
        <section
          className={styles.day}
          key={day}
        >
          <h2>
            <DocumentDate value={day} />
            <span className={styles.count}>
              {translate(
                {id: 'docnest.updates.dayCount', message: ', documents: {total}'},
                {total: items.length},
              )}
            </span>
          </h2>
          <ul className={styles.list}>
            {items.map((e) => (
              <li
                key={e.url}
                className={styles.entry}
              >
                <span
                  className={styles.status}
                  data-new={e.isNew}
                >
                  {e.isNew
                    ? translate({id: 'docnest.new', message: 'New'})
                    : translate({id: 'docnest.updated', message: 'Updated'})}
                </span>
                <Link
                  to={e.url}
                  className={styles.title}
                >
                  {e.title}
                </Link>
                <span className={styles.space}>{spaceLabel(e.instance)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {total === 0 && (
        <p>
          {translate({id: 'docnest.updates.empty', message: 'No documents match these filters.'})}
        </p>
      )}
    </div>
  );
}
