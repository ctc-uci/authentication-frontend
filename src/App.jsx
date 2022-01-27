import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './App.css';

import LoginTest from './components/LoginTest';
import LogoutTest from './components/LogoutTest';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginTest />} />
          <Route exact path="/logout" element={<LogoutTest />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
