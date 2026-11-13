import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import homiesLogoMark from '../../assets/homies-logo-mark.svg';
import { RegisterForm } from '../components/RegisterForm';
import { AuthContext } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/authService';
import type { RegisterData } from '../types/auth.types';

export const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data: RegisterData) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await register(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={homiesLogoMark} alt="Homies logo" />
      <h2>Create your account</h2>

      <RegisterForm isSubmitting={isSubmitting} onSubmit={handleRegister} />

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p className="auth-container__switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};