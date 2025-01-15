import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/login');
  }
}

export async function checkGuest() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  if (token) {
    redirect('/dashboard');
  }
}
