import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/utils/helpers';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, icon, iconRight, hint, className, id, ...rest }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink-800 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {icon}
            </div>
          )}
          <input
            ref={ref} id={inputId}
            className={cx('input-field',
              icon && 'pl-11',
              iconRight && 'pr-11',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className)}
            {...rest}
          />
          {iconRight && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {iconRight}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={cx('text-xs mt-1.5', error ? 'text-red-600' : 'text-ink-500')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

