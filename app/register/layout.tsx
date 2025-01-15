"use client"

import { withGuest } from 'lib/auth/authGuard.tsx';

interface RegisterLayoutProps {
  children?: React.ReactNode;
}

function RegisterLayout({ children }: RegisterLayoutProps) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

export default withGuest(RegisterLayout);
