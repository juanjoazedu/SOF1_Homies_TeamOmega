import { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../auth/contexts/AuthContext';
import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import { FeedTabs, type FeedTab } from '../components/FeedTabs';
import { TweetList } from '../components/TweetList';
import { useTweetList } from '../hooks/useTweetList';
import { getFollowingTweets, getTweetsForYou } from '../services/tweetService';

export const FeedPage = () => {
  const { authState } = useContext(AuthContext);
  const uid = authState.status === 'authenticated' ? authState.sessionUser.uid : '';

  const [activeTab, setActiveTab] = useState<FeedTab>('following');

  const loadFeed = useCallback(
    () => (activeTab === 'for-you' ? getTweetsForYou(uid) : getFollowingTweets(uid)),
    [activeTab, uid],
  );
  const {
    tweets,
    isLoading,
    like,
    retweet,
  } = useTweetList(loadFeed, uid);
  const pagination = usePagination(tweets);

  const changeTab = (tab: FeedTab) => {
    setActiveTab(tab);
    pagination.goToPage(1);
  };

  const emptyMessage = activeTab === 'following'
    ? 'Your feed is empty. Follow someone or publish your first tweet.'
    : 'There are no tweets yet.';

  return (
    <div className="feed-container">
      <FeedTabs activeTab={activeTab} onChange={changeTab} />

      {isLoading ? (
        <p>Loading tweets...</p>
      ) : (
        <TweetList
          tweets={pagination.items}
          onLike={like}
          onRetweet={retweet}
          emptyMessage={emptyMessage}
        />
      )}

      {!isLoading && tweets.length > 0 && (
        <Pagination
          label="Feed pagination"
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNext={pagination.nextPage}
          onPrevious={pagination.previousPage}
        />
      )}
    </div>
  );
};