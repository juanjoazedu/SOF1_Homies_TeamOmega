import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterData } from '../types/auth.types';

export const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (data: RegisterData) => {
    try {
      register(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create the account.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create your account</h2>

      <RegisterForm onSubmit={handleRegister} />

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p className="auth-container__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};