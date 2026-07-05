import { useState, useRef, useEffect } from 'react';
import { Send, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { chatAPI } from '@/lib/api';
import type { Message } from '@/data/types';

export function ChatInput({ conversationId, onSent }: { conversationId: string; onSent?: (m: Message) => void }) {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [text, setText] = useState('');
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [sending, setSending] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const msg = await chatAPI.sendMessage(conversationId, text.trim());
      onSent?.(msg);
      setText('');
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
    finally { setSending(false); }
  };

  const makeOffer = async () => {
    const amt = Number(offerAmount);
    if (!amt || sending) return;
    setSending(true);
    try {
      const msg = await chatAPI.sendOffer(conversationId, amt);
      onSent?.(msg);
      setOfferAmount('');
      setShowOffer(false);
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
    finally { setSending(false); }
  };

  return (
    <div className="border-t border-ink-100 bg-white p-3">
      <AnimatePresence>
        {showOffer && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-2">
            <div className="bg-primary-50 rounded-xl p-3 flex items-center gap-2">
              <Tag size={16} className="text-primary-700" />
              <span className="text-sm text-ink-700">Offer amount:</span>
              <input type="number" autoFocus value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && makeOffer()}
                placeholder="₹0"
                className="flex-1 px-3 py-1.5 rounded-lg border border-primary-200 bg-white text-sm focus:outline-none focus:border-primary-500" />
              <Button size="sm" variant="purple" onClick={makeOffer} loading={sending}>Send offer</Button>
              <button onClick={() => setShowOffer(false)} className="p-1.5 rounded-lg hover:bg-primary-100 text-ink-500">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-end gap-2">
        <button onClick={() => setShowOffer((s) => !s)}
          className={`p-2.5 rounded-xl transition-colors ${showOffer ? 'bg-primary-100 text-primary-700' : 'text-ink-500 hover:bg-ink-100'}`}>
          <Tag size={18} />
        </button>
        <div className="flex-1 relative">
          <textarea ref={taRef} value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message…" rows={1} className="input-field resize-none max-h-32 pr-12" />
        </div>
        <Button variant="purple" onClick={send} disabled={!text.trim() || sending} className="!p-3"><Send size={18} /></Button>
      </div>
    </div>
  );
}
