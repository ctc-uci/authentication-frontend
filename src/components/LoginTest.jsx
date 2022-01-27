import React, { useState, useEffect } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { auth, logInWithEmailAndPassword, useAuthState, useNavigate } from '../utils/auth_utils';

const LoginTest = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [user, loading, error] = useAuthState(auth);

  const cookieConfig = {
    maxAge: 3600,
    path: '/',
  };

  const handleSubmit = e => {
    e.preventDefault();
    logInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (loading || error) return;
    if (user) {
      navigate('/logout');
      cookies.set('accessToken', user.accessToken, cookieConfig);
    }
  }, [user, loading]);
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

LoginTest.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LoginTest);
