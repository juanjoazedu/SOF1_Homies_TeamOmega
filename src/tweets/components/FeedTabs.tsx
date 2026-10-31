export type FeedTab = 'for-you' | 'following';

interface FeedTabsProps {
  activeTab: FeedTab;
  onChange: (tab: FeedTab) => void;
}

const tabs: { id: FeedTab; label: string }[] = [
  { id: 'for-you', label: 'For you' },
  { id: 'following', label: 'Following' },
];

export const FeedTabs = ({ activeTab, onChange }: FeedTabsProps) => (
  <div className="feed-tabs" role="tablist" aria-label="Feed">
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          className={isActive ? 'feed-tabs__tab feed-tabs__tab--active' : 'feed-tabs__tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);