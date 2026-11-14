import { useState } from 'react';

import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../ui/components/Pagination';
import { FeedTabs, type FeedTab } from '../components/FeedTabs';
import { TweetList } from '../components/TweetList';
import { useTweets } from '../hooks/useTweets';

export const FeedPage = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');

  const {
    items,
    isLoading,
    like,
    retweet,
  } = useTweets(activeTab);
  const pagination = usePagination(items);

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
        <p className="page-status">Loading tweets...</p>
      ) : (
        <TweetList
          items={pagination.items}
          onLike={like}
          onRetweet={retweet}
          emptyMessage={emptyMessage}
        />
      )}

      {!isLoading && items.length > 0 && (
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