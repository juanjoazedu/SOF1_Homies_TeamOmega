import { useContext } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { AppRouter } from '../../routes/AppRouter';
import { Header } from './Header';

export const AppLayout = () => {
  const { authState } = useContext(AuthContext);
  const isAuthenticated = authState.status === 'authenticated';

  if (!isAuthenticated) {
    return <AppRouter />;
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <AppRouter />
      </main>
    </div>
  );
};