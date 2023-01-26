import type { UserRecord } from 'firebase-admin/auth';

function serializeAuthUser(user: UserRecord) {
  return {
    uid: user.uid,
    email: getValue(user.email),
    emailVerified: user.emailVerified,
    displayName: getValue(user.displayName),
    photoURL: getValue(user.photoURL),
    phoneNumber: getValue(user.phoneNumber),
    disabled: user.disabled,
    customClaims: user.customClaims ?? {},
    tenantId: getValue(user.tenantId),
    providerData: user.providerData.map((item) => {
      return JSON.parse(JSON.stringify(item.toJSON()));
    }),
    multiFactor: user.multiFactor
      ? user.multiFactor.enrolledFactors.map((item) => {
          return {
            displayName: getValue(item.displayName),
            uid: item.uid,
            factorId: item.factorId,
            enrollmentTime: getValue(item.enrollmentTime),
          };
        })
      : null,
  };
}

export default serializeAuthUser;

/**
 * @description Guards against undefined values
 * @param value
 */
function getValue<T>(value: Maybe<T>) {
  return value ?? null;
}
