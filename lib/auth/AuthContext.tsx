'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/init';
import { setAuthCookie, removeAuthCookie } from './utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('🔐 Auth state changed:', user?.email);
      setUser(user);
      setLoading(false);
      
      if (user) {
        try {
          const token = await user.getIdToken();
          const userId = user.uid;
          // Set both auth token and user ID cookies
          setAuthCookie(token, userId);
          console.log('🍪 Auth cookies set for user:', userId);
        } catch (err) {
          console.error('Failed to set auth cookies:', err);
          setError('Failed to set authentication cookies');
        }
      } else {
        removeAuthCookie();
        console.log('🗑️ Auth cookies removed');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('🔑 Attempting login...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful');
      
      // Auth state change listener will handle cookie setting
      return userCredential.user;
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      // Auth state change listener will handle cookie removal
    } catch (err) {
      console.error('Logout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
