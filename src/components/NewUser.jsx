import React, { useState } from 'react';
import { useNavigate, finishGoogleLoginRegistration } from '../utils/auth_utils';

const NewUser = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      finishGoogleLoginRegistration('/logout', navigate);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>New User</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default NewUser;
