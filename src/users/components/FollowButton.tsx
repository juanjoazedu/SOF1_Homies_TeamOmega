import { useState } from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

export const FollowButton = ({ isFollowing, onFollow, onUnfollow } : FollowButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isFollowing) {
      onUnfollow();
    } else {
      onFollow();
    }

    setIsHovered(false);
  };

  const buttonText = isFollowing
    ? isHovered
      ? 'Unfollow'
      : 'Following'
    : 'Follow';

  const buttonClass = isFollowing
    ? isHovered
      ? 'follow-button follow-button--following follow-button--danger'
      : 'follow-button follow-button--following'
    : 'follow-button';

  return (
    <button
      type="button"
      className={ buttonClass }
      onClick={ handleClick }
      onMouseEnter={ () => isFollowing && setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false) }
    >
      {buttonText}
    </button>
  );
};