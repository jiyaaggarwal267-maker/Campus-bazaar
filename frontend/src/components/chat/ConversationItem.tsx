import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import type { Conversation, Product, User, Message } from '@/data/types';
import { Avatar } from '@/components/ui/Avatar';
import { timeAgo, cx } from '@/utils/helpers';

export function ConversationItem({ convo, product, otherUser, lastMessage, isActive }: {
  convo: Conversation; product: Product; otherUser: User; lastMessage?: Message; isActive: boolean;
}) {
  return (
    <Link to={`/chat/${convo._id}`}>
      <motion.div whileHover={{ x: 2 }}
        className={cx('flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer',
          isActive ? 'bg-primary-50' : 'hover:bg-ink-50')}>
        <div className="relative">
          <Avatar src={otherUser.avatar} name={otherUser.name} size={44} />
          <img src={product.images[0]} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md object-cover ring-2 ring-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-ink-900 text-sm truncate">{otherUser.name}</p>
            <span className="text-[10px] text-ink-400 flex-shrink-0">{timeAgo(convo.updatedAt).replace('about ', '')}</span>
          </div>
          <p className={cx('text-xs truncate mt-0.5 flex items-center gap-1',
            convo.unread > 0 ? 'text-ink-900 font-medium' : 'text-ink-500')}>
            {lastMessage?.type === 'offer' ? (
              <><Tag size={11} className="text-primary-600" />
                <span>Offer: ₹{lastMessage.offer?.amount.toLocaleString()}</span></>
            ) : <span>{lastMessage?.content || 'No messages yet'}</span>}
          </p>
          <p className="text-[11px] text-ink-400 truncate mt-0.5">{product.title}</p>
        </div>
        {convo.unread > 0 && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
      </motion.div>
    </Link>
  );
}
