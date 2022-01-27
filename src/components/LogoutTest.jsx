import React from 'react';
import { withCookies } from 'react-cookie';
import { logout, useNavigate } from '../utils/auth_utils';

const LogoutTest = () => {
  const navigate = useNavigate();

  const deleteCookie = name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleSubmit = async () => {
    await logout();
    navigate('/');
    deleteCookie('accessToken');
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

export default withCookies(LogoutTest);
