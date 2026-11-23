import { cn } from '@/lib/utils';

/** Indian FSSAI vegetarian symbol: green dot inside a green square. Pass `label` when no visible text accompanies it. */
export function VegMark({ className, label }: { className?: string; label?: string }) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-flex w-3.5 h-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-green-700', className)}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
    </span>
  );
}
