import React, { useState } from 'react';
import { logout, useNavigate } from '../utils/auth_utils';

const Logout = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const handleSubmit = async () => {
    try {
      await logout('/', navigate);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <button type="submit" onClick={handleSubmit}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
