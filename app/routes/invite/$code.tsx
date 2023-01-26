import { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { z } from 'zod';

import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useSubmit, useTransition } from '@remix-run/react';
import { useAuth, useSigninCheck } from 'reactfire';

import {
  acceptInviteToOrganization,
  getInviteByCode,
  getUserRoleByOrganization,
} from '~/lib/server/organizations/memberships.server';

import { serializeOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { serializeCsrfSecretCookie } from '~/lib/server/cookies/csrf-secret.cookie';

import {
  getSessionIdCookie,
  parseSessionIdCookie,
} from '~/lib/server/cookies/session.cookie';

import If from '~/core/ui/If';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';

import configuration from '~/configuration';
import isBrowser from '~/core/generic/is-browser';

import OAuthProviders from '~/components/auth/OAuthProviders';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';

import GuardedPage from '~/core/firebase/components/GuardedPage';
import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import createCsrfToken from '~/core/generic/create-csrf-token';
import createServerSideSession from '~/core/firebase/admin/auth/create-server-side-session';

import {
  throwBadRequestException,
  throwForbiddenException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import EmailPasswordSignUpContainer from '~/components/auth/EmailPasswordSignUpContainer';
import EmailPasswordSignInContainer from '~/components/auth/EmailPasswordSignInContainer';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';

import useGetCsrfToken from '~/core/firebase/hooks/use-get-csrf-token';
import withCsrf from '~/core/middleware/with-csrf';
import type { SerializedUserAuthData } from '~/core/session/types/user-session';
import withFirebaseAdmin from '~/core/middleware/with-firebase-admin';
import getUserInfoById from '~/core/firebase/admin/auth/get-user-info-by-id';
import getLogger from '~/core/logger';
import AuthCatchBoundary from '~/components/auth/AuthCatchBoundary';

enum Mode {
  SignUp,
  SignIn,
}

interface Invite {
  code: string;

  organization: {
    id: string;
    name: string;
  };
}

export const CatchBoundary = AuthCatchBoundary;

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Join Organization`,
    'csrf-token': data?.csrfToken,
  };
};

const InvitePage = () => {
  const data = useLoaderData<typeof loader>();
  const [user, setUser] = useState(data.user);
  const signInCheck = useSigninCheck();

  const transition = useTransition();
  const invite = data.invite as Invite;
  const organization = invite.organization;

  useEffect(() => {
    if (signInCheck.status === 'success' && !signInCheck.data.signedIn) {
      setUser(undefined);
    }
  }, [signInCheck]);

  if (transition.state === 'submitting') {
    return (
      <PageLoadingIndicator>
        <Trans
          i18nKey={'auth:addingToOrganization'}
          values={{ name: organization.name }}
          components={{ b: <b /> }}
        />
      </PageLoadingIndicator>
    );
  }

  return (
    <>
      <Heading type={4}>
        <Trans
          i18nKey={'auth:joinOrganizationHeading'}
          values={{
            organization: invite.organization.name,
          }}
        />
      </Heading>

      <div>
        <p className={'text-center'}>
          <Trans
            i18nKey={'auth:joinOrganizationSubHeading'}
            values={{
              organization: invite.organization.name,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p className={'text-center'}>
          <If condition={!user}>
            <Trans i18nKey={'auth:signUpToAcceptInvite'} />
          </If>
        </p>
      </div>

      <AcceptInviteContainer inviteCode={invite.code} user={user} />
    </>
  );
};

function AcceptInviteContainer({
  inviteCode,
  user,
}: React.PropsWithChildren<{
  inviteCode: string;
  user: Maybe<SerializedUserAuthData> | null;
}>) {
  const auth = useAuth();
  const submit = useSubmit();
  const getCsrfToken = useGetCsrfToken();
  const transition = useTransition();
  const redirectOnSignOut = getRedirectPath();
  const [mode, setMode] = useState<Mode>(Mode.SignUp);

  const onInviteAccepted = useCallback(
    (idToken: string) => {
      const csrfToken = getCsrfToken() ?? '';

      const body = {
        code: inviteCode,
        idToken,
        csrfToken,
      };

      return submit(body, {
        method: 'post',
      });
    },
    [getCsrfToken, inviteCode, submit]
  );

  if (transition.state !== 'idle') {
    return <PageLoadingIndicator />;
  }

  return (
    <>
      {/* FLOW FOR AUTHENTICATED USERS */}
      <If condition={user}>
        <GuardedPage whenSignedOut={redirectOnSignOut}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              return onInviteAccepted('');
            }}
            className={'flex flex-col space-y-8'}
          >
            <p className={'text-center text-sm'}>
              <Trans
                i18nKey={'auth:clickToAcceptAs'}
                values={{ email: user?.email }}
                components={{ b: <b /> }}
              />
            </p>

            <Button data-cy={'accept-invite-submit-button'} type={'submit'}>
              <Trans i18nKey={'auth:acceptInvite'} />
            </Button>

            <div>
              <div className={'flex flex-col space-y-2'}>
                <p className={'text-center'}>
                  <span
                    className={
                      'text-center text-sm text-gray-700 dark:text-gray-300'
                    }
                  >
                    <Trans i18nKey={'auth:acceptInviteWithDifferentAccount'} />
                  </span>
                </p>

                <Button
                  block
                  color={'transparent'}
                  size={'small'}
                  onClick={() => auth.signOut()}
                  type={'button'}
                >
                  <Trans i18nKey={'auth:signOut'} />
                </Button>
              </div>
            </div>
          </form>
        </GuardedPage>
      </If>

      {/* FLOW FOR NEW USERS */}
      <If condition={!user}>
        <OAuthProviders onSignIn={onInviteAccepted} />

        <If condition={configuration.auth.providers.emailPassword}>
          <If condition={mode === Mode.SignUp}>
            <div className={'flex w-full flex-col items-center space-y-4'}>
              <EmailPasswordSignUpContainer onSignUp={onInviteAccepted} />

              <Button
                block
                color={'transparent'}
                size={'small'}
                onClick={() => setMode(Mode.SignIn)}
              >
                <Trans i18nKey={'auth:alreadyHaveAccountStatement'} />
              </Button>
            </div>
          </If>

          <If condition={mode === Mode.SignIn}>
            <div className={'flex w-full flex-col items-center space-y-4'}>
              <EmailPasswordSignInContainer onSignIn={onInviteAccepted} />

              <Button
                block
                color={'transparent'}
                size={'small'}
                onClick={() => setMode(Mode.SignUp)}
              >
                <Trans i18nKey={'auth:doNotHaveAccountStatement'} />
              </Button>
            </div>
          </If>
        </If>

        <If condition={configuration.auth.providers.phoneNumber}>
          <PhoneNumberSignInContainer onSignIn={onInviteAccepted} />
        </If>

        <If condition={configuration.auth.providers.emailLink}>
          <EmailLinkAuth />
        </If>
      </If>
    </>
  );
}

export default InvitePage;

export async function loader(args: LoaderArgs) {
  await withFirebaseAdmin();

  const code = args.params.code;
  const logger = getLogger();

  // if the code wasn't provided we cannot continue
  // so, we redirect to 404
  if (!code) {
    return throwNotFoundException();
  }

  const inviteRef = await getInviteByCode(code).catch(() => undefined);
  const invite = inviteRef?.data();

  // if the invite wasn't found, it's 404
  if (!invite) {
    logger.warn(
      {
        code,
      },
      `User navigated to invite page, but it wasn't found. Redirecting to home page...`
    );

    return throwNotFoundException();
  }

  try {
    const sessionId = await parseSessionIdCookie(args.request);
    const user = await getLoggedInUser(sessionId).catch(() => undefined);
    const userId = user?.uid;
    const userData = userId ? await getUserInfoById(userId) : undefined;

    const organizationId = invite.organization.id;

    // We check if the user is already part of the organization
    if (userId) {
      const userRole = await getUserRoleByOrganization({
        organizationId,
        userId,
      });

      const isPartOfOrganization = userRole !== undefined;

      // if yes, we redirect the user to the error page
      if (isPartOfOrganization) {
        return throwForbiddenException();
      }
    }

    const { token: csrfToken, secret } = await createCsrfToken();

    return json(
      {
        user: userData,
        invite,
        csrfToken,
      },
      {
        headers: {
          'Set-Cookie': await serializeCsrfSecretCookie(secret),
        },
      }
    );
  } catch (e) {
    logger.debug(e);

    logger.error(
      `Error encountered while fetching invite. Redirecting to home page...`
    );

    return redirectToHomePage();
  }
}

/**
 * @name action
 * @param args
 */
export async function action(args: ActionArgs) {
  const req = args.request;
  const formData = await req.formData();
  const fields = Object.fromEntries(formData.entries());
  const result = await getBodySchema().safeParseAsync(fields);

  if (!result.success) {
    return throwBadRequestException();
  }

  await withCsrf(req, result.data.csrfToken);

  const logger = getLogger();
  const headers = new Headers();
  const { code, idToken } = result.data;

  let userId: string;

  if (idToken) {
    const serializedSessionId = await createServerSideSession(idToken);
    const cookie = await getSessionIdCookie();
    const sessionId = await cookie.parse(serializedSessionId);
    const user = await getLoggedInUser(sessionId);

    userId = user?.uid;

    headers.append('Set-Cookie', serializedSessionId);
  } else {
    userId = await getUserIdFromSession(req);
  }

  logger.info(
    {
      code,
      userId,
    },
    `Adding member to organization...`
  );

  const invite = await acceptInviteToOrganization({ code, userId });
  const organizationId = invite.organization.id;

  logger.info(
    {
      code,
      organizationId,
      userId,
    },
    `Member successfully added to organization`
  );

  headers.append(
    'Set-Cookie',
    await serializeOrganizationIdCookie(organizationId)
  );

  return redirect(configuration.paths.appHome, {
    headers,
  });
}

function redirectToHomePage() {
  return redirect('/');
}

function getRedirectPath() {
  return isBrowser() ? window.location.pathname : undefined;
}

function getBodySchema() {
  return z.object({
    code: z.string().min(1),
    idToken: z.string(),
    csrfToken: z.string().min(1),
  });
}

async function getUserIdFromSession(request: Request) {
  const sessionId = await parseSessionIdCookie(request);
  const user = await getLoggedInUser(sessionId);

  return user.uid;
}
