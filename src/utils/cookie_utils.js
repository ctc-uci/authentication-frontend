/**
 * Options for the format of a cookie
 * More information available here: https://www.npmjs.com/package/react-cookie
 * This is used when setting a cookie
 */
const cookieConfig = {
  maxAge: 3600,
  path: '/',
  secure: true,
};

/**
 * An object containing keys for cookies to store
 * This is used to set and remove cookies
 */
const cookieKeys = {
  ACCESS_TOKEN: 'accessToken',
  ROLE: 'role',
};

/**
 * Gets a cookie value by name if it exists
 */
const getCookie = key => {
  const cookie = `; ${document.cookie}`.match(`;\\s*${key}\\s*=([^;]+)`);
  return cookie ? cookie[1] : '';
};

/**
 * Sets a cookie in the browser
 */
const setCookie = (key, value, config) => {
  let cookie = `${key}=${value}; max-age=${config.maxAge}; path=${config.path}`;

  if (config.domain) {
    cookie += `; domain=${config.domain}`;
  }
  if (config.secure) {
    cookie += '; secure';
  }

  document.cookie = cookie;
};

/**
 * Removes a cookie by name
 */
const removeCookie = key => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Clears all cookies stored during log in
 */
const clearCookies = () => {
  Object.values(cookieKeys).forEach(value => {
    removeCookie(value);
  });
};

export { cookieConfig, cookieKeys, clearCookies, setCookie, getCookie };
