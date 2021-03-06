import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './App.css';

import AdminInvite from './components/AdminInvite';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import Logout from './components/Logout';
import ProtectedRoute from './utils/ProtectedRoute';
import Register from './components/register/register';
import EmailAction from './components/EmailAction';
import NewUser from './components/NewUser';

import AUTH_ROLES from './utils/auth_config';

const { ADMIN_ROLE, USER_ROLE } = AUTH_ROLES.AUTH_ROLES;

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            exact
            path="admin"
            element={
              <ProtectedRoute Component={Logout} redirectPath="/logout" roles={[ADMIN_ROLE]} />
            }
          />
          <Route
            exact
            path="/adminInvite"
            element={
              <ProtectedRoute Component={AdminInvite} redirectPath="/" roles={[ADMIN_ROLE]} />
            }
          />
          <Route exact path="/emailAction" element={<EmailAction redirectPath="/" />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            exact
            path="/logout"
            element={
              <ProtectedRoute Component={Logout} redirectPath="/" roles={[ADMIN_ROLE, USER_ROLE]} />
            }
          />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/new-user" element={<NewUser />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
