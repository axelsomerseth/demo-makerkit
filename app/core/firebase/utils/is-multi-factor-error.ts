import { FirebaseError } from 'firebase/app';
import type { MultiFactorError } from 'firebase/auth';

export default function isMultiFactorError(
  error: unknown
): error is MultiFactorError {
  if (error instanceof FirebaseError) {
    return error.code === `auth/multi-factor-auth-required`;
  }

  return false;
}
