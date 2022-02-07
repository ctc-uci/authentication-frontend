import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './App.css';
import Register from './components/register/register';

import Login from './components/Login';
import Logout from './components/Logout';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route
            exact
            path="/logout"
            element={
              <ProtectedRoute Component={Logout} redirectPath="/" roles={['admin', 'General']} />
            }
          />
          <Route
            exact
            path="admin"
            element={<ProtectedRoute Component={Logout} redirectPath="/logout" roles={['admin']} />}
          />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
