import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth/auth';
import { KitchenBoard } from '@/components/kitchen/KitchenBoard';

export const dynamic = 'force-dynamic';

export default async function KitchenPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/admin/login');
  }

  return <KitchenBoard staffName={session.name} />;
}
