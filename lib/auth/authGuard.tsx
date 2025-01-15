"use client"

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../components/auth/AuthProvider';

export function withAuth(WrappedComponent: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuthContext();
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
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        router.push('/dashboard');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
