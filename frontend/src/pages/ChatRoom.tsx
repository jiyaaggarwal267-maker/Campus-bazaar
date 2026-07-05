import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Info, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { chatAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { Conversation, Message } from '@/data/types';

export default function ChatRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { conversations, fetchConversations } = useApp();
  const [convo, setConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        await fetchConversations();
        const msgs = await chatAPI.getMessages(id);
        setMessages(msgs);
        const found = conversations.find((c) => c._id === id);
        setConvo(found || null);
        socket?.emit('joinConversation', id);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    const onNewMessage = (m: Message) => {
      if (m.conversation === id) setMessages((prev) => [...prev, m]);
    };
    const onNewOffer = (m: Message) => {
      if (m.conversation === id) setMessages((prev) => [...prev, m]);
    };
    const onOfferUpdate = (updated: any) => {
      setMessages((prev) => prev.map((m) =>
        m.offer && m.offer._id === updated._id ? { ...m, offer: updated } : m
      ));
    };
    socket.on('newMessage', onNewMessage);
    socket.on('newOffer', onNewOffer);
    socket.on('offerUpdate', onOfferUpdate);
    return () => {
      socket.off('newMessage', onNewMessage);
      socket.off('newOffer', onNewOffer);
      socket.off('offerUpdate', onOfferUpdate);
    };
  }, [socket, id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (loading) return <div className="p-12 text-center text-ink-500">Loading…</div>;
  if (!convo) return <div className="p-12 text-center">Conversation not found.</div>;

  const other = convo.other;
  const product = convo.product;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/chat" className="btn-ghost mb-4 -ml-2"><ArrowLeft size={16} /> All messages</Link>
      <div className="card overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
        <div className="border-b border-ink-100 p-4 flex items-center gap-3 bg-white">
          <Avatar src={other.avatar} name={other.name} size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-ink-900">{other.name}</p>
              {other.isTrustedSeller && <Badge variant="purple"><ShieldCheck size={11} /> Trusted</Badge>}
            </div>
            <p className="text-xs text-ink-500 truncate">About: {product.title}</p>
          </div>
          <button className="p-2 rounded-xl hover:bg-ink-100 hidden sm:block"><Phone size={18} /></button>
          <button className="p-2 rounded-xl hover:bg-ink-100 hidden sm:block"><Info size={18} /></button>
        </div>
        <Link to={`/product/${product._id}`} className="flex items-center gap-3 p-3 bg-ink-50 hover:bg-ink-100 transition-colors border-b border-ink-100">
          <img src={product.images[0]} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ink-900 text-sm truncate">{product.title}</p>
            <p className="text-sm font-bold text-primary-700">{price(product.price)}</p>
          </div>
          <span className="text-xs text-primary-600 font-medium">View item →</span>
        </Link>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-ink-50/50">
          {messages.map((m) => (
            <MessageBubble key={m._id} message={m} isOwn={typeof m.sender === 'object' ? m.sender._id === user?._id : m.sender === user?._id} />
          ))}
        </div>
        <ChatInput conversationId={convo._id} onSent={(m) => setMessages((prev) => [...prev, m])} />
      </div>
    </div>
  );
}

const price = (n: number) => `₹${n.toLocaleString('en-IN')}`;
