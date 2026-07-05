import { Link } from 'react-router-dom';
import { Heart, MapPin, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, User } from '@/data/types';
import { Badge } from '@/components/ui/Badge';
import { price, timeAgo } from '@/utils/helpers';

type Props = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: Props) {
  const seller = typeof product.seller === 'object' ? (product.seller as User) : null;

  const statusVariant: Record<Product['status'], 'success' | 'warning' | 'default'> = {
    available: 'success',
    reserved: 'warning',
    sold: 'default',
  };

  const statusLabel: Record<Product['status'], string> = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
  };

  const fallbackAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(seller?.name || 'User')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
    >
      <Link to={`/product/${product._id}`} className="block group">
        <div className="card overflow-hidden">

          {/* IMAGE */}
          <div className="relative aspect-square overflow-hidden bg-ink-100">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-3 left-3">
              <Badge variant={statusVariant[product.status]}>
                {statusLabel[product.status]}
              </Badge>
            </div>

            <button
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <Heart size={16} className="text-ink-700" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-4">
            <h3 className="font-semibold text-ink-900 line-clamp-1 group-hover:text-primary-700 transition-colors mb-1">
              {product.title}
            </h3>

            <p className="text-xl font-bold text-ink-950 mb-2">
              {price(product.price)}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <MapPin size={12} />
              {product.college}

              {seller?.isTrustedSeller && (
                <BadgeCheck size={12} className="text-primary-600 ml-1" />
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={seller?.avatar || fallbackAvatar}
                  className="w-6 h-6 rounded-full ring-2 ring-white"
                  alt="seller"
                />
                <span className="text-xs text-ink-700 font-medium">
                  {seller?.name?.split(' ')[0] || 'User'}
                </span>
              </div>

              <span className="text-xs text-ink-400">
                {timeAgo(product.createdAt)}
              </span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}