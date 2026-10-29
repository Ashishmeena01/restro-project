import * as React from 'react';
import { cn } from '@/lib/utils';

export function Alert({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) {
  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 text-sm', variant === 'destructive' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-slate-200 bg-slate-50 text-slate-900', className)}
      {...props}
    />
  );
}
