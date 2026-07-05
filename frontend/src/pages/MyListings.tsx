import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { price, timeAgo } from '@/utils/helpers';
import { productAPI } from '@/lib/api';
import type { Product } from '@/data/types';

export default function MyListings() {
  const { showToast } = useApp();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setMyProducts(await productAPI.my()); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await productAPI.remove(id);
      setMyProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Deleted', 'Listing removed');
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink-950">My listings</h1>
          <p className="text-ink-500 text-sm">Manage your items</p>
        </div>
        <Link to="/create-listing" className="btn-purple"><Plus size={16} /> New listing</Link>
      </div>
      {loading ? <p className="text-ink-500">Loading…</p> : myProducts.length === 0 ? (
        <EmptyState icon={<Plus size={28} />} title="No listings yet"
          description="Create your first listing to start selling."
          action={<Link to="/create-listing" className="btn-purple">Create listing</Link>} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr className="text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Listed</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {myProducts.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-ink-50/50">
                    <td className="px-4 py-3">
                      <Link to={`/product/${p._id}`} className="flex items-center gap-3 group">
                        <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-ink-900 group-hover:text-primary-700 line-clamp-1">{p.title}</p>
                          <p className="text-xs text-ink-500">{p.category}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink-900">{price(p.price)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'available' ? 'success' : p.status === 'reserved' ? 'warning' : 'default'}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-600"><span className="inline-flex items-center gap-1"><Eye size={12} /> {p.views}</span></td>
                    <td className="px-4 py-3 text-ink-500 text-xs">{timeAgo(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-600"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
