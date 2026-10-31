import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleLogin = (username: string, password: string) => {
    setInfoMessage('');
    const isValid = login(username, password);

    if (!isValid) {
      setErrorMessage('Incorrect username or password.');
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage('');
    setInfoMessage('Google sign-in will be available once Firebase is connected.');
  };

  return (
    <div className="auth-container">
      <h2>Log in to Homies</h2>

      <LoginForm onSubmit={handleLogin} />

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p className="auth-container__divider">or</p>

      <button
        type="button"
        className="auth-container__provider"
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </button>

      {infoMessage && <p role="status">{infoMessage}</p>}

      <p className="auth-container__switch">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};