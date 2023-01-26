import { Outlet } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import loadAuthPageData from '~/lib/server/loaders/load-auth-page-data';
import AuthPageShell from '~/components/auth/AuthPageShell';

export const loader = loadAuthPageData;

export const meta: MetaFunction = ({ data }) => {
  return {
    'csrf-token': data?.csrfToken,
  };
};

function AuthLayout() {
  return (
    <AuthPageShell>
      <Outlet />
    </AuthPageShell>
  );
}

export default AuthLayout;
