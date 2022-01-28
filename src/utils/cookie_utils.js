import { withCookies, Cookies } from 'react-cookie';

const cookieConfig = {
  maxAge: 3600,
  path: '/',
};

const cookieKeys = {
  ACCESS_TOKEN: 'accessToken',
};

const clearCookies = cookies => {
  Object.values(cookieKeys).forEach(value => {
    cookies.remove(value);
  });
};

export { withCookies, Cookies, cookieConfig, cookieKeys, clearCookies };
