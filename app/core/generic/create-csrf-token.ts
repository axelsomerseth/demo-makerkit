import Csrf from 'csrf';

/**
 * @name createCsrfToken
 */
async function createCsrfToken() {
  const csrf = new Csrf();
  const secret = await csrf.secret();
  const token = csrf.create(secret);

  return {
    token,
    secret,
  };
}

export default createCsrfToken;
