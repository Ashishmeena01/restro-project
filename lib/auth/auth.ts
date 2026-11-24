import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';

const AUTH_COOKIE_NAME = 'vrindavan_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'vrindavan_super_secret_jwt_key_change_in_production_2026_xyz'
);

export type UserRole = 'ADMIN' | 'STAFF' | 'KITCHEN';

export interface SessionPayload {
  userId: string;
  businessId: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Sign a JWT session token valid for 7 days
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get current session from cookie in Server Actions or Route Handlers
 */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Authenticate user with email and plain password
 */
export async function authenticateUser(email: string, passwordPlain: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { business: true },
  });

  if (!user || !user.isActive) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isValidPassword = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isValidPassword) {
    return { success: false, error: 'Invalid email or password' };
  }

  const payload: SessionPayload = {
    userId: user.id,
    businessId: user.businessId,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
  };

  const token = await signSessionToken(payload);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, user: payload };
}

/**
 * Log out and clear session cookie
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Require admin or staff role; throws error or returns null if unauthorized
 */
export async function requireAuth(allowedRoles: UserRole[] = ['ADMIN', 'STAFF']) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Unauthorized. Please log in.');
  }

  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden. Insufficient permissions.');
  }

  return session;
}
