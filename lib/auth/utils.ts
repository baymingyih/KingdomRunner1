// Helper function to get a cookie by name from document.cookie
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

export function getAuthCookie() {
  if (typeof document === 'undefined') {
    // This function might be called server-side in some contexts,
    // though primarily it's for client-side checks now.
    // For server-side, you'd use next/headers.cookies() directly in Route Handlers/Server Components.
    console.warn('getAuthCookie called on the server where document is not available.');
    return undefined; 
  }
  return getCookie('auth_token');
}

export function isAuthenticated() {
  // Client-side check only
  return !!getAuthCookie();
}

export function setAuthCookie(token: string, userId: string) {
  if (typeof document === 'undefined') {
    console.error('setAuthCookie cannot be called on the server.');
    return;
  }
  
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
  const domain = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
  const commonOptions = `path=/; domain=${domain}; max-age=${maxAge}; SameSite=Lax`;
  
  // Set auth token cookie
  console.log('Setting auth_token cookie...'); // Debug logging
  document.cookie = `auth_token=${encodeURIComponent(token)}; ${commonOptions}`;
  console.log('Auth token cookie set:', document.cookie.includes('auth_token'));
  
  // Set user ID cookie
  console.log('Setting user_id cookie...'); // Debug logging
  document.cookie = `user_id=${encodeURIComponent(userId)}; ${commonOptions}`;
  console.log('User ID cookie set:', document.cookie.includes('user_id'));
  
  console.log('After setting, document.cookie:', document.cookie);
}

export function removeAuthCookie() {
  if (typeof document === 'undefined') {
    console.error('removeAuthCookie cannot be called on the server.');
    return;
  }
  
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const domain = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
  const commonOptions = `path=/; domain=${domain}; ${expires}; SameSite=Lax`;
  
  // Remove auth token cookie
  document.cookie = `auth_token=deleted; ${commonOptions}`;
  
  // Remove user ID cookie
  document.cookie = `user_id=deleted; ${commonOptions}`;
  
  console.log('Auth cookies removed. Current cookies:', document.cookie);
}
