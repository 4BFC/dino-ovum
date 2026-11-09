import OriginalCategory from '@theme-init/DocSidebarItem/Category';

export default function Category(props) {
  return (
    <OriginalCategory
      {...props}
      onKeyDown={(event) => {
        if (event.key === ' ' && event.currentTarget.getAttribute('role') === 'button') {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    />
  );
}
