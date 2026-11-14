import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import homiesLogoMark from '../../assets/homies-logo-mark.svg';
import { LoginForm } from '../components/LoginForm';
import { AuthContext } from '../contexts/AuthContext';
import { getErrorMessage } from '../services/authService';

export const LoginPage = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runAction = async (action: () => Promise<void>) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await action();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  const handleLogin = (username: string, password: string) => {
    runAction(() => login(username, password));
  };

  const handleGoogleLogin = () => {
    runAction(loginWithGoogle);
  };

  return (
    <div className="auth-container">
      <img src={homiesLogoMark} alt="Homies logo" />
      <h2>Log in to Homies</h2>

      <LoginForm isSubmitting={isSubmitting} onSubmit={handleLogin} />

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p className="auth-container__divider">or</p>

      <button
        type="button"
        className="auth-container__provider"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
      >
        Continue with Google
      </button>

      <p className="auth-container__switch">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};