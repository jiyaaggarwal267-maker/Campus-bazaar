import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function ToastContainer() {
  const { toast } = useApp();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink-950 text-white rounded-2xl shadow-soft-lg px-5 py-3.5 flex items-center gap-3 min-w-[280px] max-w-md"
        >
          <CheckCircle2 className="text-primary-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.body && <p className="text-xs text-ink-300 mt-0.5">{toast.body}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

