import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ConversationItem } from '@/components/chat/ConversationItem';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { chatAPI } from '@/lib/api';
import { useState } from 'react';

export default function ChatList() {
  const { user } = useAuth();
  const { conversations, fetchConversations } = useApp();
  const [params] = useSearchParams();
  const withUser = params.get('with');
  const productId = params.get('product');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (withUser && productId && user) {
      (async () => {
        try {
          const convo = await chatAPI.getOrCreate(productId);
          window.location.href = `/chat/${convo._id}`;
        } catch (e) { console.error(e); }
      })();
    }
  }, [withUser, productId, user]);

  if (withUser) return null;

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    return c.other.name.toLowerCase().includes(search.toLowerCase()) ||
           c.product.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink-950 mb-1">Messages</h1>
        <p className="text-ink-500 text-sm">Chat with buyers and sellers</p>
      </div>
      <div className="mb-4">
        <Input placeholder="Search conversations…" icon={<Search size={16} />}
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<MessageCircle size={28} />} title="No conversations yet"
          description="Start by messaging a seller about a listing you like."
          action={<Link to="/browse" className="btn-purple">Browse listings</Link>} />
      ) : (
        <div className="card divide-y divide-ink-100 p-2">
          {filtered.map((c) => (
            <ConversationItem key={c._id} convo={c} product={c.product} otherUser={c.other}
              lastMessage={c.lastMessage} isActive={false} />
          ))}
        </div>
      )}
    </div>
  );
}
