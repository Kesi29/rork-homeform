import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSaves } from '@/contexts/SaveContext';

export default function AuthSaveBridge() {
  const { user } = useAuth();
  const { setUser } = useSaves();

  useEffect(() => {
    setUser(user?.id ?? null);
  }, [user?.id, setUser]);

  return null;
}
