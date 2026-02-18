import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { User } from '@/types';
import { trpc } from '@/lib/trpc';

const AUTH_KEY = 'auth_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
        return parsed;
      }
      return null;
    },
  });

  const signInBackend = trpc.users.signIn.useMutation();

  const signInMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      let backendUser: User | null = null;
      try {
        const result = await signInBackend.mutateAsync({ email, name });
        backendUser = {
          id: result.id,
          email: result.email,
          name: result.name,
          role: result.role,
          created_at: result.created_at,
        };
      } catch (e) {
        console.log('Backend sign in failed, using local fallback', e);
        backendUser = {
          id: `u_${Date.now()}`,
          email,
          name,
          role: 'homeowner',
          created_at: new Date().toISOString(),
        };
      }
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(backendUser));
      return backendUser;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      setShowAuthModal(false);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const updateProfileBackend = trpc.users.updateProfile.useMutation();

  const updateProfileMutation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name: string }) => {
      try {
        await updateProfileBackend.mutateAsync({ email, name });
      } catch (e) {
        console.log('Backend profile update failed', e);
      }
      const updated: User = {
        ...user!,
        email,
        name,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(AUTH_KEY);
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const requireAuth = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    showAuthModal,
    setShowAuthModal,
    signIn: (data: { email: string; name: string }) => signInMutation.mutate(data),
    signOut: signOutMutation.mutate,
    updateProfile: (data: { email: string; name: string }) => updateProfileMutation.mutate(data),
    isSigningIn: signInMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    requireAuth,
  };
});
