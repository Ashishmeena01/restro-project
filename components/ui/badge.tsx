import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'border-transparent bg-primary text-white hover:bg-primary-hover',
  secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
  destructive: 'border-transparent bg-rose-600 text-white hover:bg-rose-700',
  outline: 'text-slate-700',
  success: 'border-transparent bg-emerald-100 text-emerald-800',
  warning: 'border-transparent bg-amber-100 text-amber-800',
};

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)} {...props} />;
}
