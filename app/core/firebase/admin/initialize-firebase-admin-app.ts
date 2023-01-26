import configuration from '~/configuration';
import firebaseConfig from '../../../firebase.config';
import invariant from 'tiny-invariant';

/**
 * @description Initializes the firebase Admin app.
 * If emulator=true, will start the emulator admin
 */
export default async function initializeFirebaseAdminApp() {
  const emulator = configuration.emulator;

  if (emulator) {
    const { createEmulatorAdminApp } = await import(
      './create-emulator-admin-app'
    );

    return createEmulatorAdminApp();
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = firebaseConfig.projectId;
  const storageBucket = firebaseConfig.storageBucket;

  invariant(clientEmail, `Firebase Client email not provided`);
  invariant(privateKey, `Firebase Private key not provided`);
  invariant(projectId, `GCloud Project ID not provided`);
  invariant(storageBucket, `Firebase Storage bucket not provided`);

  const { createFirebaseAdminApp } = await import('./create-admin-app');

  return createFirebaseAdminApp({
    projectId,
    storageBucket,
    clientEmail,
    privateKey,
  });
}
