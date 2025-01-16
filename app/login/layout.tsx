"use client"

import React, { ReactNode } from 'react';
import { withGuest } from 'lib/auth/authGuard';
import { ComponentType } from 'react';

interface LoginLayoutProps {
  children?: ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return <div className="min-h-screen bg-background">{children}</div>;
};

export default withGuest(LoginLayout);
