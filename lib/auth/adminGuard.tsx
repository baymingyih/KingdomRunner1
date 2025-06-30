"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUser } from '@/lib/db/users';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;
      
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userProfile = await getUser(user.uid);
        const adminStatus = userProfile?.isAdmin || false;
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verifying Access</h3>
            <p className="text-muted-foreground">Checking admin permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (isAdmin === false) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-4">
              You don't have admin privileges to access this area.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-primary hover:underline"
            >
              Return to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Portal</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminGuard>
        <WrappedComponent {...props} />
      </AdminGuard>
    );
  };
}