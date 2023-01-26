import { useCallback, useState } from 'react';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { z } from 'zod';
import { Trans } from 'react-i18next';

import Logo from '~/core/ui/Logo';
import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import Button from '~/core/ui/Button';
import { throwBadRequestException } from '~/core/http-exceptions';

import type { OrganizationInfoStepData } from '~/components/onboarding/OrganizationInfoStep';
import OrganizationInfoStep from '~/components/onboarding/OrganizationInfoStep';
import OnboardingIllustration from '~/components/onboarding/OnboardingIllustration';
import CompleteOnboardingStep from '~/components/onboarding/CompleteOnboardingStep';

import getCurrentOrganization from '~/lib/server/organizations/get-current-organization';
import completeOnboarding from '~/lib/server/onboarding/complete-onboarding';
import { serializeOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';

import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';
import getUserInfoById from '~/core/firebase/admin/auth/get-user-info-by-id';

import withMethodsGuard from '~/core/middleware/with-methods-guard';
import UserSessionContext from '~/core/session/contexts/user-session';
import type UserSession from '~/core/session/types/user-session';

import firebaseConfig from '../../firebase.config';
import configuration from '~/configuration';

interface Data {
  organization: string;
}

export const meta: MetaFunction = () => {
  return {
    title: `Onboarding - ${configuration.site.siteName}`,
  };
};

const Onboarding = () => {
  const data = useLoaderData() as UserSession;

  const [currentStep, setCurrentStep] = useState(0);
  const [userSession, setUserSession] = useState<Maybe<UserSession>>(data);
  const [formData, setFormData] = useState<Data>();

  const onFirstStepSubmitted = useCallback(
    (organizationInfo: OrganizationInfoStepData) => {
      setFormData({
        organization: organizationInfo.organization,
      });

      setCurrentStep(1);
    },
    []
  );

  return (
    <FirebaseAppShell config={firebaseConfig}>
      <FirebaseAuthProvider
        useEmulator={firebaseConfig.emulator}
        userSession={userSession}
        setUserSession={setUserSession}
      >
        <UserSessionContext.Provider value={{ userSession, setUserSession }}>
          <div className={'flex flex-1 flex-col dark:bg-black-500'}>
            <div
              className={'flex divide-x divide-gray-100 dark:divide-black-300'}
            >
              <div
                className={
                  'flex h-screen flex-1 flex-col items-center justify-center' +
                  ' w-full lg:w-6/12'
                }
              >
                <div className={'absolute top-24 flex'}>
                  <Logo href={'/onboarding'} />
                </div>

                <div className={'w-9/12'}>
                  <If condition={currentStep === 0}>
                    <OrganizationInfoStep onSubmit={onFirstStepSubmitted} />
                  </If>

                  <If condition={currentStep === 1 && formData}>
                    {(formData) => <CompleteOnboardingStep data={formData} />}
                  </If>
                </div>
              </div>

              <div
                className={
                  'hidden w-6/12 flex-1 items-center bg-gray-50' +
                  ' justify-center dark:bg-black-400 lg:flex'
                }
              >
                <div>
                  <OnboardingIllustration />
                </div>
              </div>
            </div>
          </div>
        </UserSessionContext.Provider>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
};

export default Onboarding;

export function CatchBoundary() {
  const navigate = useNavigate();

  return (
    <div
      className={
        'flex h-screen w-full flex-1 flex-col items-center justify-center'
      }
    >
      <div className={'flex flex-col items-center space-y-8'}>
        <div>
          <Logo />
        </div>

        <Alert type={'error'}>
          <Alert.Heading>
            <Trans i18nKey={'common:genericServerError'} />
          </Alert.Heading>

          <Trans i18nKey={'common:genericServerErrorHeading'} />
        </Alert>

        <Button onClick={() => navigate('.')}>
          <Trans i18nKey={'common:retry'} />
        </Button>
      </div>
    </div>
  );
}

export async function action(args: ActionArgs) {
  const req = args.request;
  const formData = await req.formData();
  const body = JSON.parse(formData.get('data') as string);
  const parsedBody = await getBodySchema().safeParseAsync(body);

  if (!parsedBody.success) {
    return throwBadRequestException();
  }

  await withMethodsGuard(req, ['POST']);

  const sessionId = await parseSessionIdCookie(req);
  const user = await getLoggedInUser(sessionId);
  const userId = user.uid;
  const organizationName = parsedBody.data.organization;

  const data = {
    userId,
    organizationName,
  };

  const organizationId = await completeOnboarding(data);

  const headers = new Headers({
    'Set-Cookie': await serializeOrganizationIdCookie(organizationId),
  });

  return redirect(configuration.paths.appHome, {
    headers,
  });
}

export async function loader(args: LoaderArgs) {
  const sessionId = await parseSessionIdCookie(args.request);
  const user = await getLoggedInUser(sessionId).catch(() => undefined);

  if (!user) {
    throw redirectToSignIn();
  }

  const userId = user.uid;

  const [userInfo, userData] = await Promise.all([
    getUserInfoById(userId),
    getUserData(userId),
  ]);

  // if we cannot find the user's Firestore record
  // the user should go to the onboarding flow
  // so that the record wil be created after the end of the flow
  if (!userData) {
    const response: UserSession = {
      auth: userInfo || undefined,
      data: userData,
    };

    return json(response);
  }

  const organization = await getCurrentOrganization(user.uid);
  const onboarded = userInfo?.customClaims?.onboarded;

  // there are two cases when we redirect the user to the onboarding
  // 1. if they have not been onboarded yet
  // 2. if they end up with 0 organizations (for example, if they get removed)
  //
  // NB: you should remove this if you want to
  // allow organization-less users within the application
  if (onboarded && organization) {
    throw redirectToAppHome();
  }

  const response: UserSession = {
    auth: userInfo || undefined,
    data: userData,
  };

  return json(response);
}

function redirectToSignIn() {
  return redirect(configuration.paths.signIn);
}

function redirectToAppHome() {
  return redirect(configuration.paths.appHome);
}

/**
 * @name getUserData
 * @description Fetch User Firestore data decorated with its ID field
 * @param userId
 */
async function getUserData(userId: string) {
  const { getUserRefById } = await import('~/lib/server/queries');

  const ref = await getUserRefById(userId);
  const data = ref.data();

  if (data) {
    return {
      ...data,
      id: ref.id,
    };
  }
}

function getBodySchema() {
  return z.object({
    organization: z.string(),
  });
}
