import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, Conversation, Message, Notification } from '@/data/types';
import { productAPI, chatAPI, notifAPI } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuth } from './AuthContext';

interface AppCtx {
  products: Product[];
  conversations: Conversation[];
  notifications: Notification[];
  loading: boolean;
  fetchProducts: (params?: any) => Promise<void>;
  addProduct: (data: Partial<Product>) => Promise<Product>;
  reserveProduct: (id: string) => Promise<void>;
  markSold: (id: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (convoId: string) => Promise<Message[]>;
  sendMessage: (convoId: string, content: string) => Promise<void>;
  sendOffer: (convoId: string, amount: number) => Promise<void>;
  respondOffer: (offerId: string, action: 'accept' | 'reject' | 'counter', counter?: number) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAllNotifsRead: () => Promise<void>;
  toast: { id: number; title: string; body?: string } | null;
  showToast: (title: string, body?: string) => void;
}

const AppContext = createContext<AppCtx | undefined>(undefined);
let toastId = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ id: number; title: string; body?: string } | null>(null);

  const showToast = (title: string, body?: string) => {
    const id = ++toastId;
    setToast({ id, title, body });
    setTimeout(() => setToast((c) => (c?.id === id ? null : c)), 3500);
  };

  // Listen to socket events
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    const onNotification = (n: Notification) => {
      setNotifications((prev) => [n, ...prev]);
    };
    socket.on('notification', onNotification);
    return () => { socket.off('notification', onNotification); };
  }, [user]);

  const fetchProducts = useCallback(async (params: any = {}) => {
    setLoading(true);
    try {
      const data = await productAPI.list(params);
      setProducts(data);
    } finally { setLoading(false); }
  }, []);

  const addProduct = async (data: any) => {
    const created = await productAPI.create(data);
    setProducts((p) => [created, ...p]);
    showToast('Listing created!', 'Your item is now live.');
    return created;
  };

  const reserveProduct = async (id: string) => {
    await productAPI.reserve(id);
    showToast('Reserved!', 'The seller has been notified.');
  };

  const markSold = async (id: string) => {
    await productAPI.markSold(id);
    showToast('Marked as sold!', 'Transaction complete.');
  };

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const data = await chatAPI.list();
    setConversations(data);
  }, [user]);

  const fetchMessages = async (convoId: string) => {
    return await chatAPI.getMessages(convoId);
  };

  const sendMessage = async (convoId: string, content: string) => {
    await chatAPI.sendMessage(convoId, content);
  };

  const sendOffer = async (convoId: string, amount: number) => {
    await chatAPI.sendOffer(convoId, amount);
  };

  const respondOffer = async (offerId: string, action: 'accept' | 'reject' | 'counter', counter?: number) => {
    await chatAPI.respondOffer(offerId, action, counter);
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const data = await notifAPI.list();
    setNotifications(data);
  }, [user]);

  const markAllNotifsRead = async () => {
    await notifAPI.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      products, conversations, notifications, loading,
      fetchProducts, addProduct, reserveProduct, markSold,
      fetchConversations, fetchMessages, sendMessage, sendOffer, respondOffer,
      fetchNotifications, markAllNotifsRead,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
