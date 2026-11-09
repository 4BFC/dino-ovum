import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DocumentDate({value}) {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const dateFormat = new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const date = value ? new Date(`${value}T00:00:00Z`) : null;
  if (!date || Number.isNaN(date.getTime())) return '—';
  const tooltip = `${date.getUTCMonth() + 1}.${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  return (
    <time
      dateTime={value}
      title={tooltip}
      lang={currentLocale}
    >
      {dateFormat.format(date)}
    </time>
  );
}
