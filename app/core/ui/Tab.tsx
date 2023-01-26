import { Tab as HeadlessTab } from '@headlessui/react';
import { Link } from '@remix-run/react';

const Tab: React.FCC<{
  href?: string;
  disabled?: boolean;
  queryParam?: string;
}> = ({ children, href, disabled, queryParam }) => {
  const useQueryParam = queryParam ?? `tab`;
  const link = href ? `?${useQueryParam}=${href}` : '';

  return (
    <HeadlessTab
      disabled={disabled}
      className={({ selected }) => (selected ? 'TabSelected Tab' : 'Tab')}
    >
      <Link to={link}>{children}</Link>
    </HeadlessTab>
  );
};

export default Tab;
