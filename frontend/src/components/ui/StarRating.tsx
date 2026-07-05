import { Star } from 'lucide-react';
import { cx } from '@/utils/helpers';

export function StarRating({
  rating, size = 14, interactive = false, onChange, className,
}: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
  className?: string;
}) {
  return (
    <div className={cx('inline-flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(rating);
        return (
          <button
            key={i} type="button" disabled={!interactive}
            onClick={() => onChange?.(i)}
            className={cx('transition-transform', interactive && 'hover:scale-110 cursor-pointer')}
          >
            <Star
              size={size}
              className={filled ? 'fill-amber-400 text-amber-400' : 'fill-ink-200 text-ink-200'}
            />
          </button>
        );
      })}
    </div>
  );
}

