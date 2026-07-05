import type { ReactNode } from 'react';
import { cx } from '@/utils/helpers';

type Variant = 'default' | 'purple' | 'success' | 'warning' | 'danger' | 'outline';

export function Badge({
  children, variant = 'default', className, icon,
}: { children: ReactNode; variant?: Variant; className?: string; icon?: ReactNode }) {
  const variants = {
    default: 'bg-ink-100 text-ink-700',
    purple: 'bg-primary-100 text-primary-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    outline: 'border border-ink-200 text-ink-700 bg-white',
  };
  return (
    <span className={cx(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
      variants[variant], className
    )}>
      {icon}
      {children}
    </span>
  );
}
