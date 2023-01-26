import { Outlet } from '@remix-run/react';
import AuthPageShell from '~/components/auth/AuthPageShell';

function InviteLayout() {
  return (
    <AuthPageShell>
      <Outlet />
    </AuthPageShell>
  );
}

export default InviteLayout;
