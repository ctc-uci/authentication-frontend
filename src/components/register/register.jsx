import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../../utils/auth_utils';

const Register = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerWithEmailAndPassword(email, password, checkPassword, navigate, '/');
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={({ target }) => setEmail(target.value)} placeholder="Email" />
        <br />
        <input
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Password"
          type="password"
        />
        <br />
        <input
          onChange={({ target }) => setCheckPassword(target.value)}
          placeholder="Re-enter Password"
          type="password"
        />
        <br />
        <button type="submit">Register</button>
        <div className="login-buttons">
          <button type="button">
            <span>Sign Up With Google</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
