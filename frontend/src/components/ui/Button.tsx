import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cx } from '@/utils/helpers';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'purple' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, iconRight,
  fullWidth, className, children, disabled, ...rest
}: Props) {
  const variants = {
    primary: 'btn-primary',
    purple: 'btn-purple',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-base px-6 py-3.5',
  };
  return (
    <button
      disabled={disabled || loading}
      className={cx(variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" className="opacity-75" />
        </svg>
      ) : icon}
      {children}
      {iconRight}
    </button>
  );
}
