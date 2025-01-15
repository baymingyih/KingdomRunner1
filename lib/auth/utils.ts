import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';

export function getAuthCookie() {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get('auth_token');
}

export function isAuthenticated() {
  return !!getAuthCookie();
}

export function setAuthCookie(token: string) {
  (cookies() as unknown as UnsafeUnwrappedCookies).set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export function removeAuthCookie() {
  (cookies() as unknown as UnsafeUnwrappedCookies).delete('auth_token');
}