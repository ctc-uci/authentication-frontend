import React from 'react';
import { useLocation } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';

const EmailAction = () => {
  const { search } = useLocation();
  const mode = new URLSearchParams(search).get('mode');
  const code = new URLSearchParams(search).get('oobCode');
  return mode === 'resetPassword' ? <ResetPassword code={code} /> : <VerifyEmail code={code} />;
};

export default EmailAction;
