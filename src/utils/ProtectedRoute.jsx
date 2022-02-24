import React from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';

import { cookieKeys, getCookie } from './cookie_utils';
import { auth, getCurrentUser } from './auth_utils';

// TODO: Make calls to backend to verify user access token
// const verifyToken = () => {
//   return true;
// };

/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component the user is trying to access
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @param {Array} roles A list of roles that are allowed to access the route
 * @returns The relevant path to redirect the user to dependending on authentication state.
 */
const ProtectedRoute = ({ Component, redirectPath, roles }) => {
  const currentUser = getCurrentUser(auth);
  if (currentUser && roles.includes(getCookie(cookieKeys.ROLE))) {
    return <Component />;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  Component: PropTypes.elementType.isRequired,
  redirectPath: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
