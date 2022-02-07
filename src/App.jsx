import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './App.css';
import Register from './components/register/register';

import Login from './components/Login';
import Logout from './components/Logout';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/logout" element={<Logout />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
