import { Link } from '@remix-run/react';
import LogoImageMini from '~/core/ui/Logo/LogoImageMini';

const LogoMini: React.FCC<{ href?: string }> = ({ href }) => {
  return (
    <Link to={href ?? '/'}>
      <LogoImageMini />
    </Link>
  );
};

export default LogoMini;
