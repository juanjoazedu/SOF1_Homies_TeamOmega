import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthContext } from '../auth/contexts/AuthContext';
import { LoginPage } from '../auth/pages/LoginPage';
import { RegisterPage } from '../auth/pages/RegisterPage';
import { FeedPage } from '../tweets/pages/FeedPage';
import { NewTweetPage } from '../tweets/pages/NewTweetPage';
import { TweetDetailPage } from '../tweets/pages/TweetDetailPage';
import { FollowListPage } from '../users/pages/FollowListPage';
import { UserProfilePage } from '../users/pages/UserProfilePage';

export const AppRouter = () => {
  const { authState } = useContext(AuthContext);

  if (authState.status !== 'authenticated') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<FeedPage />} />
      <Route path="/compose" element={<NewTweetPage />} />
      <Route path="/u/:username/tweet/:tweetId" element={<TweetDetailPage />} />
      <Route path="/u/:username" element={<UserProfilePage />} />
      <Route
        path="/u/:username/followers"
        element={<FollowListPage key="followers" type="followers" />}
      />
      <Route
        path="/u/:username/following"
        element={<FollowListPage key="following" type="following" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};