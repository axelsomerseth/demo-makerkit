import { Link } from '@remix-run/react';
import LogoImage from './LogoImage';

const Logo: React.FCC<{ href?: string; className?: string }> = ({
  href,
  className,
}) => {
  return (
    <Link to={href ?? '/'}>
      <LogoImage className={className} />
    </Link>
  );
};

export default Logo;
