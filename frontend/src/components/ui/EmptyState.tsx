import type { ReactNode } from 'react';
import { cx } from '@/utils/helpers';

export function EmptyState({
  icon, title, description, action, className,
}: {
  icon: ReactNode; title: string; description?: string;
  action?: ReactNode; className?: string;
}) {
  return (
    <div className={cx('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

