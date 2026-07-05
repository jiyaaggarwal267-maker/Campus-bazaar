import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import type { Message, User } from '@/data/types';
import { cx, timeAgo } from '@/utils/helpers';
import { OfferCard } from './OfferCard';

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  if (message.type === 'system') {
    return <div className="flex justify-center my-2">
      <span className="text-xs text-ink-500 bg-ink-100 px-3 py-1 rounded-full">{message.content}</span>
    </div>;
  }
  if (message.type === 'offer' && message.offer) {
    return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={cx('flex mb-3', isOwn ? 'justify-end' : 'justify-start')}>
      <OfferCard offer={message.offer} isOwn={isOwn} />
    </motion.div>;
  }
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={cx('flex mb-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cx('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm',
        isOwn ? 'bg-primary-600 text-white rounded-br-md' : 'bg-white border border-ink-100 text-ink-900 rounded-bl-md')}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={cx('flex items-center gap-1 mt-1 text-[10px]',
          isOwn ? 'text-primary-100 justify-end' : 'text-ink-400')}>
          {timeAgo(message.createdAt).replace('about ', '')}
          {isOwn && (message.read ? <CheckCheck size={12} /> : <Check size={12} />)}
        </div>
      </div>
    </motion.div>
  );
}
