import Logo from '~/core/ui/Logo';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';
import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import firebaseConfig from '../../firebase.config';

function AuthPageShell({ children }: React.PropsWithChildren) {
  return (
    <FirebaseAppShell config={firebaseConfig}>
      <FirebaseAuthProvider
        useEmulator={firebaseConfig.emulator}
        userSession={undefined}
        setUserSession={() => ({})}
      >
        <div
          className={
            'flex h-screen flex-col items-center justify-center space-y-8' +
            ' lg:bg-gray-50 dark:lg:bg-black-700'
          }
        >
          <div>
            <Logo />
          </div>

          <div
            className={`flex w-11/12 max-w-xl flex-col items-center space-y-5 rounded-xl border border-transparent bg-white p-8 dark:bg-black-600 dark:bg-black-500 sm:border-gray-100 dark:sm:border-black-500 md:w-8/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12`}
          >
            {children}
          </div>
        </div>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
}

export default AuthPageShell;
