export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { logoutUser, getCurrentSession } from '@/lib/auth/auth';

export async function POST() {
  await logoutUser();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
