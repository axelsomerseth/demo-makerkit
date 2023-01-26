import Csrf from 'csrf';
import { throwUnauthorizedException } from '~/core/http-exceptions';
import { parseCsrfSecretCookie } from '~/lib/server/cookies/csrf-secret.cookie';

type TokenProvider = ((req: Request) => string | Falsy) | string | Falsy;

/**
 * @name withCsrf
 * @description Add CSRF protection to an API endpoint
 * @param request
 * @param tokenProvider
 *
 */
async function withCsrf(
  request: Request,
  tokenProvider: TokenProvider = defaultTokenProvider
) {
  const csrf = new Csrf();
  const secret = await parseCsrfSecretCookie(request);
  const token = await evaluateTokenProvider(tokenProvider)(request);

  // when signing programmatically (i.e. during tests)
  // we should skip the validation of the token
  if (isMockToken(token)) {
    return;
  }

  if (!token) {
    return throwUnauthorizedException(`CSRF token is invalid`);
  }

  if (!secret) {
    return throwUnauthorizedException(`CSRF secret not found`);
  }

  if (!csrf.verify(secret, token)) {
    return throwUnauthorizedException(`CSRF check failed`);
  }
}

function defaultTokenProvider(req: Request) {
  return req.headers.get('x-csrf-token');
}

function isTestEnv() {
  return process.env.NODE_ENV === 'test';
}

function isMockToken(token: string | Falsy) {
  return isTestEnv() && token === 'MOCKCSRFTOKEN';
}

function evaluateTokenProvider(tokenProvider: TokenProvider) {
  return (request: Request) => {
    if (typeof tokenProvider === 'string') {
      return tokenProvider;
    } else if (typeof tokenProvider === 'function') {
      return tokenProvider(request);
    }
  };
}

export default withCsrf;
