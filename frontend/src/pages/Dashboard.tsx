import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, DollarSign, Eye, Star, TrendingUp, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { productAPI } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { price, timeAgo } from '@/utils/helpers';
import type { Product } from '@/data/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setMyProducts(await productAPI.my()); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const active = myProducts.filter((p) => p.status === 'available');
  const reserved = myProducts.filter((p) => p.status === 'reserved');
  const sold = myProducts.filter((p) => p.status === 'sold');
  const earnings = sold.reduce((s, p) => s + p.price, 0);
  const totalViews = myProducts.reduce((s, p) => s + p.views, 0);

  const stats = [
    { label: 'Active listings', value: active.length, icon: Package, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Items sold', value: sold.length, icon: CheckCircle2, color: 'from-primary-500 to-primary-700' },
    { label: 'Total earnings', value: price(earnings), icon: DollarSign, color: 'from-amber-500 to-amber-700' },
    { label: 'Total views', value: totalViews.toLocaleString(), icon: Eye, color: 'from-blue-500 to-blue-700' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink-950">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-ink-500 text-sm">Here's how your shop is performing.</p>
        </div>
        <Link to="/create-listing" className="btn-purple"><Plus size={16} /> New listing</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-ink-950">{s.value}</p>
            <p className="text-xs text-ink-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold text-ink-900 mb-1">Recent activity</h2>
          <p className="text-xs text-ink-500 mb-4">Your latest listings</p>
          <div className="space-y-3">
            {loading ? <p className="text-sm text-ink-500">Loading…</p> :
              myProducts.slice(0, 5).map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50">
                  <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 text-sm truncate">{p.title}</p>
                    <p className="text-xs text-ink-500">{timeAgo(p.createdAt)}</p>
                  </div>
                  <Badge variant={p.status === 'available' ? 'success' : p.status === 'reserved' ? 'warning' : 'default'}>{p.status}</Badge>
                  <p className="font-semibold text-ink-900 text-sm">{price(p.price)}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-1">Seller rating</h2>
          <p className="text-xs text-ink-500 mb-5">Based on {user?.totalRatings} reviews</p>
          <div className="text-center py-4">
            <p className="text-5xl font-extrabold gradient-text">{user?.rating || '—'}</p>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className={i <= Math.round(user?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-ink-200 text-ink-200'} />
              ))}
            </div>
          </div>
          {user?.isTrustedSeller && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 flex items-center gap-2 mt-4">
              <CheckCircle2 className="text-primary-600" size={16} />
              <div>
                <p className="text-xs font-semibold text-primary-900">Trusted Seller</p>
                <p className="text-[10px] text-primary-700">Top 5% of sellers</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
