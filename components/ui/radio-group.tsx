import * as React from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="radiogroup" className={cn('grid gap-3', className)} {...props} />;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type: _type, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn('h-4 w-4 shrink-0 accent-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2', className)}
      {...props}
    />
  )
);
RadioGroupItem.displayName = 'RadioGroupItem';
