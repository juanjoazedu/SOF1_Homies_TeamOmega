import { useContext } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { AppRouter } from '../../routes/AppRouter';
import { UsersProvider } from '../../users/contexts/UsersProvider';
import { Header } from './Header';

export const AppLayout = () => {
  const { authState } = useContext(AuthContext);

  if (authState.status === 'checking') {
    return <p className="page-status">Loading...</p>;
  }

  if (authState.status !== 'authenticated') {
    return <AppRouter />;
  }

  return (
    <UsersProvider key={authState.sessionUser.uid}>
      <div className="app-layout">
        <Header />
        <main className="app-content">
          <AppRouter />
        </main>
      </div>
    </UsersProvider>
  );
};