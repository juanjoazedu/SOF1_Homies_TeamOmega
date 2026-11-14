import { useContext, useEffect, useState } from 'react';

import { Toast } from '../../ui/components/Toast';
import { UsersContext } from '../contexts/UsersContext';
import type { ProfileUpdate } from '../types/user.types';
import { EditProfileModal } from './EditProfileModal';

const NOTICE_DURATION_MS = 1500;

interface Notice {
  message: string;
}

export const EditProfileButton = () => {
  const { currentUser, updateProfile } = useContext(UsersContext);

  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  if (!currentUser) return null;

  const handleSubmit = async (changes: ProfileUpdate) => {
    await updateProfile(changes);
    setIsOpen(false);
    setNotice({ message: 'Profile updated successfully.' });
  };

  return (
    <>
      <button type="button" className="follow-button" onClick={() => setIsOpen(true)}>
        Edit profile
      </button>

      {isOpen && (
        <EditProfileModal
          user={currentUser}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}

      {notice && <Toast message={notice.message} />}
    </>
  );
};