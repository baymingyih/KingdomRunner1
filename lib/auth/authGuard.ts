import { redirect } from 'next/navigation';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import React, { FC, ComponentType } from 'react';

function withAuth<P extends object>(Component: ComponentType<P>) {
  const AuthenticatedComponent: FC<P> = (props) => {
    const token = (cookies() as unknown as UnsafeUnwrappedCookies).get('auth_token');

    if (!token) {
      redirect('/login');
    }

    return React.createElement(Component, props);
  };
  return AuthenticatedComponent;
}

function withGuest<P extends object>(Component: ComponentType<P>) {
  const GuestComponent: FC<P> = (props) => {
    const token = (cookies() as unknown as UnsafeUnwrappedCookies).get('auth_token');

    if (!token) {
      redirect('/login');
    }

    return React.createElement(Component, props);
  };
  return GuestComponent;
}

export { withAuth, withGuest };
