import React from 'react';
import { instanceOf } from 'prop-types';
import { logout, useNavigate } from '../utils/auth_utils';
import { clearCookies, Cookies, withCookies } from '../utils/cookie_utils';

const LogoutTest = ({ cookies }) => {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    await logout();
    navigate('/');
    clearCookies(cookies);
  };

  return (
    <div>
      <h2>Logout</h2>
      <button type="submit" onClick={handleSubmit}>
        Logout
      </button>
    </div>
  );
};

LogoutTest.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(LogoutTest);
