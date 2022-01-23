import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import LoginTest from './components/LoginTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginTest />} />
      </Routes>
    </Router>
  );
}

export default App;
