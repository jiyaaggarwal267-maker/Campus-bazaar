import { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar, type Filters } from '@/components/product/FilterSidebar';
import { categories } from '@/data/mockData';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { cx } from '@/utils/helpers';

export default function Browse() {
  const { products, fetchProducts, loading } = useApp();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'all', minPrice: '', maxPrice: '', condition: 'all', negotiable: null, college: '',
  });

  useEffect(() => {
    const params: any = { sort };
    if (search) params.search = search;
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== 'all' && v !== null) params[k] = v;
    });
    fetchProducts(params);
  }, [search, filters, sort]);

  const resetFilters = () => setFilters({
    category: 'all', minPrice: '', maxPrice: '', condition: 'all', negotiable: null, college: '',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-950 mb-1">Browse listings</h1>
        <p className="text-ink-500 text-sm">{products.length} items available</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search for anything…" icon={<Search size={16} />}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowMobileFilters(true)} className="lg:hidden btn-secondary">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-auto !py-2.5 text-sm">
            <option value="recent">Recently added</option>
            <option value="popular">Most popular</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
          </select>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}>
            <div onClick={(e) => e.stopPropagation()} className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1.5 hover:bg-ink-100 rounded-lg"><X size={18} /></button>
              </div>
              <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
            <Chip active={filters.category === 'all'} onClick={() => setFilters({ ...filters, category: 'all' })}>All</Chip>
            {categories.map((c) => (
              <Chip key={c} active={filters.category === c} onClick={() => setFilters({ ...filters, category: c })}>{c}</Chip>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-16 text-ink-500">Loading…</div>
          ) : products.length === 0 ? (
            <EmptyState icon={<Search size={28} />} title="No items found"
              description="Try adjusting your filters or search query." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cx(
      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
      active ? 'bg-ink-950 text-white' : 'bg-white text-ink-700 border border-ink-200 hover:border-ink-300')}>
      {children}
    </button>
  );
}
