import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import LoginTest from './components/LoginTest';
import LogoutTest from './components/LogoutTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginTest />} />
        <Route exact path="/logout" element={<LogoutTest />} />
      </Routes>
    </Router>
  );
}

export default App;
