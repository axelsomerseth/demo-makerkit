import isBrowser from '~/core/generic/is-browser';
import configuration from '~/configuration';
import { getCookie, setCookie } from '~/core/generic/cookies';

const THEME_KEY = `theme`;
const LIGHT_THEME_META_COLOR = configuration.site.themeColor;
const DARK_THEME_META_COLOR = configuration.site.themeColorDark;

export const DARK_THEME_CLASSNAME = `dark`;
export const LIGHT_THEME_CLASSNAME = `light`;

export function getDefaultTheme() {
  return getThemeFromHTML();
}

export function getStoredTheme() {
  return getCookie('theme');
}

export function setTheme(theme: string | null) {
  const root = getHtml();

  if (getDefaultTheme() === theme) {
    return;
  }

  if (theme === DARK_THEME_CLASSNAME) {
    root.classList.add(DARK_THEME_CLASSNAME);
    setMetaTag(DARK_THEME_META_COLOR);
    setCookie(THEME_KEY, DARK_THEME_CLASSNAME);
  } else {
    root.classList.remove(DARK_THEME_CLASSNAME);
    setMetaTag(LIGHT_THEME_META_COLOR);
    setCookie(THEME_KEY, LIGHT_THEME_CLASSNAME);
  }
}

export function loadSelectedTheme() {}

function getThemeFromHTML() {
  if (isBrowser()) {
    const root = getHtml();

    return root.classList.contains(DARK_THEME_CLASSNAME)
      ? DARK_THEME_CLASSNAME
      : LIGHT_THEME_CLASSNAME;
  }
}

function getHtml() {
  return document.firstElementChild as HTMLHtmlElement;
}

function getThemeMetaTag() {
  return document.querySelector(`meta[name='theme-color']`);
}

function setMetaTag(value: string) {
  const callback = () => {
    let tag = getThemeMetaTag();

    if (tag) {
      tag.setAttribute('content', value);
    } else {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'theme-color');
      tag.setAttribute('content', value);
      document.head.appendChild(tag);
    }
  };

  if (document.readyState === 'complete') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
