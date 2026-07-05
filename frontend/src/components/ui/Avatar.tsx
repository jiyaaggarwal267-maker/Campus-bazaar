import { cx } from '@/utils/helpers';

export function Avatar({
  src, name, size = 40, className,
}: { src?: string; name?: string; size?: number; className?: string }) {
  const initials = name
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className={cx('rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-semibold text-primary-700 ring-2 ring-white', className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
