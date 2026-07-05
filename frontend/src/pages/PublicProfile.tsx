import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Calendar, MessageCircle, Star, Package } from 'lucide-react';
import { userAPI } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { fullDate } from '@/utils/helpers';
import type { User, Product } from '@/data/types';

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setUser(await userAPI.get(id));
        setUserProducts(await userAPI.getProducts(id));
        setReviews(await userAPI.getReviews(id));
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-ink-500">Loading…</div>;
  if (!user) return <div className="p-12 text-center">User not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-32 sm:h-40 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 relative overflow-hidden mb-16">
        <div className="absolute inset-0 dot-bg opacity-20" />
      </div>
      <div className="px-2 sm:px-6 -mt-20 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
          <Avatar src={user.avatar} name={user.name} size={120} className="!ring-4 !ring-white shadow-soft-lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink-950">{user.name}</h1>
              {user.isTrustedSeller && <Badge variant="purple"><ShieldCheck size={11} /> Trusted Seller</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500 mt-1">
              {user.college && <span className="flex items-center gap-1"><MapPin size={12} /> {user.college}</span>}
              {user.year && <span>{user.year}</span>}
              <span className="flex items-center gap-1"><Calendar size={12} /> Joined {fullDate(user.createdAt).split(' · ')[0]}</span>
            </div>
            {user.bio && <p className="text-ink-700 mt-2 max-w-2xl">{user.bio}</p>}
          </div>
          <Link to="/chat"><Button variant="primary"><MessageCircle size={16} /> Message</Button></Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Rating', value: user.rating || '—', sub: `${user.totalRatings} reviews` },
            { label: 'Sales', value: user.totalSales, sub: 'items sold' },
            { label: 'Listings', value: userProducts.length, sub: 'active' },
            { label: 'Verified', value: user.isVerified ? 'Yes ✓' : 'No', sub: 'college email' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-ink-500 mt-1">{s.label}</p>
              <p className="text-[10px] text-ink-400">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-ink-900 mb-4">Active listings</h2>
            {userProducts.length === 0 ? <p className="text-sm text-ink-500">No active listings.</p> : (
              <div className="grid grid-cols-2 gap-4">
                {userProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-ink-900 mb-4">Recent reviews</h2>
            {reviews.length === 0 ? <p className="text-sm text-ink-500">No reviews yet.</p> : (
              <div className="space-y-3">
                {reviews.map((r: any) => (
                  <div key={r._id} className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar src={r.rater?.avatar} name={r.rater?.name} size={32} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink-900">{r.rater?.name}</p>
                      </div>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                    {r.review && <p className="text-sm text-ink-700 leading-relaxed">{r.review}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
