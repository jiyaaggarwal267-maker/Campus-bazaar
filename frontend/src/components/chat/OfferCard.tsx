import { Tag, Check, X, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Offer } from '@/data/types';
import { price, cx } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';

export function OfferCard({ offer, isOwn }: { offer: Offer; isOwn: boolean }) {
  const { respondOffer, showToast } = useApp();
  const statusColors = {
    pending: 'border-amber-300 bg-amber-50',
    accepted: 'border-emerald-300 bg-emerald-50',
    rejected: 'border-red-300 bg-red-50',
    countered: 'border-primary-300 bg-primary-50',
  };
  const statusLabels = {
    pending: 'Awaiting response',
    accepted: 'Offer accepted',
    rejected: 'Offer rejected',
    countered: 'Counter offer sent',
  };

  const handleAction = async (action: 'accept' | 'reject' | 'counter') => {
    try {
      let counter: number | undefined;
      if (action === 'counter') {
        const input = prompt('Enter counter offer amount (₹):');
        counter = Number(input);
        if (!counter || counter <= 0) return;
      }
      await respondOffer(offer._id, action, counter);
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
  };

  return (
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
      className={cx('border-2 rounded-2xl p-4 w-72 shadow-soft-md', statusColors[offer.status])}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Tag size={14} className="text-primary-600" />
        </div>
        <div>
          <p className="text-xs text-ink-500 font-medium">{isOwn ? 'You offered' : 'You received an offer'}</p>
          <p className="text-lg font-bold text-ink-950">{price(offer.amount)}</p>
        </div>
      </div>
      {offer.status === 'pending' && !isOwn && (
        <div className="space-y-2 mt-3">
          <div className="flex gap-2">
            <Button size="sm" variant="primary" className="flex-1 !py-2" onClick={() => handleAction('accept')}>
              <Check size={14} /> Accept
            </Button>
            <Button size="sm" variant="secondary" className="flex-1 !py-2" onClick={() => handleAction('reject')}>
              <X size={14} /> Reject
            </Button>
          </div>
          <Button size="sm" variant="purple" fullWidth className="!py-2" onClick={() => handleAction('counter')}>
            <ArrowLeftRight size={14} /> Counter offer
          </Button>
        </div>
      )}
      {offer.status === 'pending' && isOwn && <p className="text-xs text-ink-600 mt-2">Waiting for seller to respond…</p>}
      {offer.status === 'countered' && offer.counterAmount && (
        <div className="mt-3 pt-3 border-t border-ink-200/50 flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-primary-600" />
          <p className="text-xs text-ink-600">Counter: <span className="font-bold text-ink-900">{price(offer.counterAmount)}</span></p>
        </div>
      )}
      {offer.status !== 'pending' && (
        <p className={cx('text-xs font-medium mt-2',
          offer.status === 'accepted' ? 'text-emerald-700' :
          offer.status === 'rejected' ? 'text-red-700' : 'text-primary-700')}>
          {statusLabels[offer.status]}
        </p>
      )}
    </motion.div>
  );
}
