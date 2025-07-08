import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

export function generateCsrfToken(uid: string): string {
  const timestamp = Date.now();
  const hash = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(`${uid}|${timestamp}`)
    .digest('hex');
  return `${uid}.${timestamp}.${hash}`;
}

export function verifyCsrfToken(token: string, uid: string): boolean {
  try {
    const [tokenUid, timestamp, hash] = token.split('.');
    if (tokenUid !== uid) return false;

    // Token expires after 24 hours
    if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedHash = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(`${uid}|${timestamp}`)
      .digest('hex');

    return hash === expectedHash;
  } catch (error) {
    return false;
  }
}
