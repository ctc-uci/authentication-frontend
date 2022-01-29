import React, { useState } from 'react';
import { instanceOf } from 'prop-types';
import { cookieConfig, cookieKeys, Cookies, withCookies } from '../utils/cookie_utils';
import {
  auth,
  logInWithEmailAndPassword,
  useNavigate,
  signInWithGoogle,
} from '../utils/auth_utils';

const LoginTest = ({ cookies }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  /**
   * This function handles logging in with email/password (standard log in)
   * If the user signs in successfully, they are redirected to /logout, otherwise they are redirected to the login screen
   * @param {Event} e
   */
  const handleSubmit = async e => {
    e.preventDefault();
    const success = await logInWithEmailAndPassword(email, password);
    if (success) {
      navigate('/logout');
      cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
    } else {
      navigate('/');
    }
  };

  /**
   * This function handles logging in with Google
   * If the user logs in and is new, they are directed to a new-user path
   * If the user logs in and isn't new, they are directed to the dashboard.
   * If the user fails to log in, they are directed back to the login screen
   */
  const handleGoogleSignIn = async () => {
    const newUser = await signInWithGoogle();
    switch (newUser) {
      case true:
        navigate('/new-user');
        cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
        break;
      case false:
        navigate('/logout');
        cookies.set(cookieKeys.ACCESS_TOKEN, auth.currentUser.accessToken, cookieConfig);
        break;
      default:
        navigate('/');
    }
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
      <button type="submit" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

LoginTest.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LoginTest);
