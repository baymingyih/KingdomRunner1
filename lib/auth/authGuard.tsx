"use client"

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';

export function withAuth(WrappedComponent: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export function withGuest<P extends { children?: React.ReactNode }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function GuestComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Removed automatic redirect to dashboard
    // User will stay on current page after login

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
