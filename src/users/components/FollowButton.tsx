import { useState } from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

const getButtonText = (isFollowing: boolean, isHovered: boolean): string => {
  if (!isFollowing) return 'Follow';
  return isHovered ? 'Unfollow' : 'Following';
};

const getButtonClass = (isFollowing: boolean, isHovered: boolean): string => {
  if (!isFollowing) return 'follow-button';
  if (isHovered) return 'follow-button follow-button--following follow-button--danger';
  return 'follow-button follow-button--following';
};

export const FollowButton = ({ isFollowing, onFollow, onUnfollow }: FollowButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isFollowing) {
      onUnfollow();
    } else {
      onFollow();
    }

    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (isFollowing) setIsHovered(true);
  };

  return (
    <button
      type="button"
      className={getButtonClass(isFollowing, isHovered)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getButtonText(isFollowing, isHovered)}
    </button>
  );
};