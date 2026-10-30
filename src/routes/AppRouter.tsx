import { useContext } from 'react';
import { AuthContext } from '../auth/contexts/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../auth/pages/LoginPage';
import { RegisterPage } from '../auth/pages/RegisterPage';
import { FeedPage } from '../tweets/pages/FeedPage';
import { UserProfilePage } from '../users/pages/UserProfilePage';
import { FollowersPage } from '../users/pages/FollowersPage';
import { FollowingPage } from '../users/pages/FollowingPage';
import { NewTweetPage } from '../tweets/pages/NewTweetPage';
import { TweetDetailPage } from '../tweets/pages/TweetDetailPage';

export const AppRouter = () => {
  const { authState } = useContext(AuthContext);

  if (authState.status !== 'authenticated') {
    return(
      <Routes>
        <Route path='/login' element={ <LoginPage /> } />
        <Route path='/register' element={ <RegisterPage /> } />
        <Route path='*' element={ <Navigate to='/login' replace /> } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/' element={ <FeedPage /> } />
      <Route path='/compose' element={ <NewTweetPage /> } />
      <Route path="/u/:username/tweet/:tweetId" element={<TweetDetailPage />} />
      <Route path='/u/:username' element={ <UserProfilePage /> } />
      <Route path='/u/:username/followers' element={ <FollowersPage /> } />
      <Route path='/u/:username/following' element={ <FollowingPage /> } />
      <Route path='*' element={ <Navigate to='/' replace /> } />
    </Routes>
  );
};