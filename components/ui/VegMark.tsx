import { cn } from '@/lib/utils';

/** Indian FSSAI vegetarian symbol: green dot inside a green square. */
export function VegMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex w-3.5 h-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-green-700', className)}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
    </span>
  );
}
