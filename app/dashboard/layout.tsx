"use client"

import { withAuth } from 'lib/auth/authGuard.tsx';

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

export default withAuth(DashboardLayout);
