import { useEffect, useState } from 'react';

import { subscribeToAllUsers } from '../services/userService';
import type { UserSummary } from '../types/user.types';

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((allUsers) => {
      setUsers(allUsers);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { users, isLoading };
};