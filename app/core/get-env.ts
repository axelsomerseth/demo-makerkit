import isBrowser from '~/core/generic/is-browser';

function getEnv() {
  return isBrowser() ? window.ENV : process.env;
}

export default getEnv;
