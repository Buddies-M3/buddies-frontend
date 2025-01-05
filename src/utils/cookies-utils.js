import Cookies from 'js-cookie';

export const USER_ID = "user-id";
export const USER_LOCAL_ID = "user-local-id";
export const USER_TOKEN = "user-token";
export const UID = "uid";

const COOKIE_NAME = 'cookies-accepted';

export const setCookie = (key, value, options) => {
  Cookies.set(key, value, options);
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const removeCookie = (key) => {
  Cookies.remove(key);
};

export const userAcceptedCookies = () => {
  return getCookie(COOKIE_NAME) === 'true';
};

export const markCookiesAsAccepted = () => {
  setCookie(COOKIE_NAME, 'true', { expires: 365 }); // Set a cookie that expires in 365 days
};