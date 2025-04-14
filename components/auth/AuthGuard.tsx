"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './AuthProvider';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}

export function AuthGuard({ 
  children,
  redirectTo = '/register',
  message = 'Please sign in to access this page'
}: AuthGuardProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`${redirectTo}?message=${encodeURIComponent(message)}`);
    }
  }, [user, loading, router, redirectTo, message]);

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
