import { Links, Meta, Scripts, useCatch } from '@remix-run/react';
import { Trans } from 'react-i18next';

import Container from '~/core/ui/Container';
import Button from '~/core/ui/Button';
import Hero from '~/core/ui/Hero';
import If from '~/core/ui/If';
import SubHeading from '~/core/ui/SubHeading';

import SiteHeader from '~/components/SiteHeader';
import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';

import firebaseConfig from '../firebase.config';
import HttpStatusCode from '~/core/generic/http-status-code.enum';

function RootCatchBoundary() {
  const error = useCatch();

  return (
    <html>
      <head>
        <Meta />
        <Links />
        <Scripts />
      </head>
      <body>
        <FirebaseAppShell config={firebaseConfig}>
          <FirebaseAuthProvider
            useEmulator={firebaseConfig.emulator}
            userSession={undefined}
            setUserSession={() => ({})}
          >
            <SiteHeader />

            <Container>
              <div>
                <Hero>
                  <If
                    condition={error.status === HttpStatusCode.NotFound}
                    fallback={<Trans i18nKey={'common:genericServerError'} />}
                  >
                    <Trans i18nKey={'common:pageNotFound'} />
                  </If>
                </Hero>

                <SubHeading>
                  <If
                    condition={error.status === HttpStatusCode.NotFound}
                    fallback={
                      <Trans i18nKey={'common:genericServerErrorHeading'} />
                    }
                  >
                    <Trans i18nKey={'common:pageNotFoundSubHeading'} />
                  </If>
                </SubHeading>
              </div>

              <div className={'my-4'}>
                <Button href={'/'}>
                  <Trans i18nKey={'common:backToHomePage'} />
                </Button>
              </div>
            </Container>
          </FirebaseAuthProvider>
        </FirebaseAppShell>
      </body>
    </html>
  );
}

export default RootCatchBoundary;
