import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth_utils';

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

export default LogoutTest;
