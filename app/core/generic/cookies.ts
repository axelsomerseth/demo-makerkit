import { unescapeComponent } from 'uri-js';

export function getCookie(name: string) {
  const cookieDict = document.cookie
    .split(';')
    .map((x) => x.split('='))
    .reduce((accum, current) => {
      accum[current[0]] = current[1];
      return accum;
    }, Object());

  return JSON.parse(decodeURIComponent(atob(cookieDict[name])));
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeCookie(value)}; Path=/`;
}

export function encodeCookie(value: string) {
  return btoa(unescapeComponent(encodeURIComponent(JSON.stringify(value))));
}
