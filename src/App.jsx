import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Register from './components/register/register';

import LoginTest from './components/LoginTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginTest />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
