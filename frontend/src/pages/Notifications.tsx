import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, Tag, CheckCircle2, XCircle, Hand, Star, Check, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { timeAgo, cx } from '@/utils/helpers';

const iconMap = {
  message: { icon: MessageCircle, color: 'bg-blue-100 text-blue-700' },
  offer: { icon: Tag, color: 'bg-primary-100 text-primary-700' },
  'offer-accepted': { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  'offer-rejected': { icon: XCircle, color: 'bg-red-100 text-red-700' },
  'offer-countered': { icon: Tag, color: 'bg-primary-100 text-primary-700' },
  reserved: { icon: Hand, color: 'bg-amber-100 text-amber-700' },
  sold: { icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-700' },
  rating: { icon: Star, color: 'bg-amber-100 text-amber-700' },
} as const;

export default function Notifications() {
  const { notifications, fetchNotifications, markAllNotifsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => { fetchNotifications(); }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-950">Notifications</h1>
          <p className="text-ink-500 text-sm">{unread} unread</p>
        </div>
        {unread > 0 && <Button variant="secondary" size="sm" onClick={markAllNotifsRead}><Check size={14} /> Mark all read</Button>}
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="No notifications yet"
          description="We'll let you know when something important happens." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {notifications.map((n, i) => {
            const meta = iconMap[n.type as keyof typeof iconMap] || iconMap.message;
            const Icon = meta.icon;
            return (
              <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={n.link || '#'} className={cx('flex items-start gap-3 p-4 hover:bg-ink-50 transition-colors', !n.read && 'bg-primary-50/40')}>
                  <div className={cx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', meta.color)}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink-900 text-sm">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-ink-600 mt-0.5">{n.body}</p>
                    <p className="text-xs text-ink-400 mt-1.5">{timeAgo(n.createdAt)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
