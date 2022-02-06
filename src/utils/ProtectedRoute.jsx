import React from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes, instanceOf } from 'prop-types';

import { withCookies, cookieKeys, Cookies } from './cookie_utils';
import { auth } from './auth_utils';

// TODO: Make calls to backend to verify user access token
// const verifyToken = () => {
//   return true;
// };

/**
 * Returns the current user synchronously
 * @param {Auth} authInstance
 * @returns The current user (or undefined)
 */
const getCurrentUser = authInstance =>
  new Promise((resolve, reject) => {
    const unsubscribe = authInstance.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component the user is trying to access
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @param {Array} roles A list of roles that are allowed to access the route
 * @param {Cookies} cookies The user's current cookies
 * @returns The relevant path to redirect the user to dependending on authentication state.
 */
const ProtectedRoute = ({ children, redirectPath, roles, cookies }) => {
  const currentUser = getCurrentUser(auth);
  if (currentUser && roles.includes(cookies.get(cookieKeys.ROLE))) {
    // console.log(roles.includes(cookies.get(cookieKeys.ROLE)));
    return children;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
  redirectPath: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(ProtectedRoute);
