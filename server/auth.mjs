import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { db } from './db.mjs';

const SESSION_DAYS = 30;
export const COOKIE = 'sw_session';
const SCRYPT = { N: 16384, r: 8, p: 1 };

export function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 64, SCRYPT);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(pw, stored) {
  const [, saltB64, hashB64] = String(stored).split('$');
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(pw, Buffer.from(saltB64, 'base64'), expected.length, SCRYPT);
  return timingSafeEqual(expected, actual);
}

/** A login on any device creates its own session; all sessions of a user see the same account data. */
export async function createSession(userId) {
  const token = randomBytes(32).toString('base64url');
  const expires = Date.now() + SESSION_DAYS * 864e5;
  await db.run('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [token, userId, expires]);
  await db.run('DELETE FROM sessions WHERE expires_at < ?', [Date.now()]);
  return { token, expires };
}

export async function destroySession(token) {
  if (token) await db.run('DELETE FROM sessions WHERE token = ?', [token]);
}

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function sessionCookie(token, expires, secure) {
  const parts = [`${COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Expires=${new Date(expires).toUTCString()}`];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export async function attachUser(req, _res, next) {
  try {
    const token = parseCookies(req.headers.cookie)[COOKIE];
    req.sessionToken = token;
    if (token) {
      const row = await db.one(
        'SELECT u.id, u.email, u.name, u.prefs FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?',
        [token, Date.now()]
      );
      if (row) req.user = { id: Number(row.id), email: row.email, name: row.name, prefs: JSON.parse(row.prefs || '{}') };
    }
    next();
  } catch (e) {
    next(e);
  }
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  next();
}
