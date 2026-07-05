import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, MapPin, Eye, Calendar, MessageCircle, Tag, Hand, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { ProductCard } from '@/components/product/ProductCard';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { productAPI, chatAPI, productAPI as pAPI } from '@/lib/api';
import { price, timeAgo } from '@/utils/helpers';
import type { Product, User } from '@/data/types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchProducts, reserveProduct, markSold, showToast } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productAPI.get(id);
        setProduct(data);
        const all = await productAPI.list({ category: data.category, status: 'available' });
        setSimilar(all.filter((p: Product) => p._id !== data._id).slice(0, 4));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-ink-500">Loading…</div>;
  if (!product) return <div className="p-12 text-center">Product not found.</div>;

  const seller = typeof product.seller === 'object' ? (product.seller as User) : null;
  const isOwn = seller?._id === user?._id;

  const handleMessage = async () => {
    try {
      const convo = await chatAPI.getOrCreate(product._id);
      navigate(`/chat/${convo._id}`);
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
  };

  const handleReserve = async () => {
    setBusy(true);
    try {
      await reserveProduct(product._id);
      setShowReserveModal(false);
      const updated = await productAPI.get(product._id);
      setProduct(updated);
      showToast('Reserved!', 'The seller has been notified.');
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
    finally { setBusy(false); }
  };

  const handleMarkSold = async () => {
    setBusy(true);
    try {
      await markSold(product._id);
      const updated = await productAPI.get(product._id);
      setProduct(updated);
      showToast('Marked as sold!', 'Transaction complete.');
    } catch (e: any) { showToast('Error', e.response?.data?.error); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2"><ArrowLeft size={16} /> Back</button>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-100 mb-3">
            <img src={product.images[activeImg]} className="w-full h-full object-cover" />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImg((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"><ChevronLeft size={18} /></button>
                <button onClick={() => setActiveImg((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"><ChevronRight size={18} /></button>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={product.status === 'available' ? 'success' : product.status === 'reserved' ? 'warning' : 'default'}>{product.status}</Badge>
            {product.negotiable && <Badge variant="purple">Negotiable</Badge>}
            <Badge variant="outline">{product.condition.replace('-', ' ')}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-ink-950 mb-3">{product.title}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-4xl font-extrabold text-ink-950">{price(product.price)}</p>
            {product.negotiable && <span className="text-sm text-ink-500">Or best offer</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600 mb-6 pb-6 border-b border-ink-100">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {product.college}</span>
            <span className="flex items-center gap-1.5"><Eye size={14} /> {product.views} views</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {timeAgo(product.createdAt)}</span>
          </div>
          {seller && (
            <div onClick={() => navigate(`/profile/${seller._id}`)} className="card p-4 mb-6 flex items-center gap-3 cursor-pointer hover:border-primary-200">
              <Avatar src={seller.avatar} name={seller.name} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-ink-900">{seller.name}</p>
                  {seller.isTrustedSeller && <Badge variant="purple"><ShieldCheck size={11} /> Trusted</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <StarRating rating={seller.rating} size={12} />
                  <span>{seller.rating} · {seller.totalRatings} reviews · {seller.totalSales} sales</span>
                </div>
              </div>
            </div>
          )}
          {isOwn ? (
            <div className="space-y-3">
              {product.status === 'reserved' && <Button variant="primary" fullWidth size="lg" onClick={handleMarkSold} loading={busy}>Mark as sold</Button>}
              {product.status === 'sold' && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">✓ This item has been sold.</div>}
            </div>
          ) : (
            <div className="space-y-3">
              {product.status === 'available' && (
                <>
                  <Button variant="primary" fullWidth size="lg" onClick={handleMessage}>
                    <MessageCircle size={18} /> Message {seller?.name?.split(' ')[0]}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" size="lg" onClick={handleMessage}>
                      <Tag size={16} /> Make offer
                    </Button>
                    <Button variant="purple" size="lg" onClick={() => setShowReserveModal(true)}>
                      <Hand size={16} /> Reserve
                    </Button>
                  </div>
                </>
              )}
              {product.status === 'reserved' && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 text-center">⏳ This item is currently reserved.</div>}
              {product.status === 'sold' && <div className="bg-ink-100 rounded-xl p-3 text-sm text-ink-600 text-center">This item has been sold.</div>}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 mb-16">
        <h2 className="text-lg font-semibold text-ink-900 mb-3">Description</h2>
        <p className="text-ink-700 leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      {similar.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-ink-950 mb-6">Similar items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {similar.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}

      <Modal open={showReserveModal} onClose={() => setShowReserveModal(false)} title="Reserve this item">
        <p className="text-sm text-ink-600 mb-5">Reserving holds this item. The seller will be notified and you can meet on campus.</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowReserveModal(false)} fullWidth>Cancel</Button>
          <Button variant="purple" onClick={handleReserve} loading={busy} fullWidth>
            <Hand size={16} /> Reserve for {price(product.price)}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
