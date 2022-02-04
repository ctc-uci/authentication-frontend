import React from 'react';
import { Navigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';

import { auth } from './auth_utils';
import { withCookies } from './cookie_utils';

// TODO: Make calls to backend to verify user access token
// const verifyToken = () => {
//   return true;
// };

/**
 * Protects a route from unauthenticated users
 * @param {Component} children The component thre user is trying to access
 * @param {Cookies} cookies The user's current cookies
 * @param {string} redirectPath The path to redirect the user to if they're not logged in
 * @returns The relevant path to redirect the user to dependending on authentication state.
 */
const ProtectedRoute = ({ children, redirectPath }) => {
  if (auth.currentUser) {
    // TODO: Get user roles from cookies for additional verification
    return children;
  }
  return <Navigate to={redirectPath} />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.elementType.isRequired,
  redirectPath: PropTypes.string.isRequired,
};

export default withCookies(ProtectedRoute);
