import React, { useState } from 'react';
import { logInWithEmailAndPassword } from '../utils/auth_utils';

const LoginTest = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    logInWithEmailAndPassword(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={({ target }) => setEmail(target.value)} placeholder="Email" />
        <br />
        <input onChange={({ target }) => setPassword(target.value)} placeholder="Password" />
        <br />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default LoginTest;
