import { categories } from '@/data/mockData';
import { cx } from '@/utils/helpers';

export interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  negotiable: boolean | null;
  college: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

const conditions = ['new', 'like-new', 'good', 'fair'];
const colleges = ['All colleges', 'IIT Delhi', 'IIT Bombay', 'IIIT Delhi', 'DTU', 'BITS Pilani'];

export function FilterSidebar({ filters, onChange, onReset }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    onChange({ ...filters, [k]: v });

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="card p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-ink-900">Filters</h3>
          <button onClick={onReset} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Reset all
          </button>
        </div>

        <FilterSection title="Category">
          <div className="space-y-1.5">
            <FilterPill
              active={filters.category === 'all'}
              onClick={() => set('category', 'all')}
              label="All categories"
            />
            {categories.map((c) => (
              <FilterPill
                key={c} active={filters.category === c}
                onClick={() => set('category', c)} label={c}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price range">
          <div className="flex items-center gap-2">
            <input
              type="number" placeholder="Min" value={filters.minPrice}
              onChange={(e) => set('minPrice', e.target.value)}
              className="input-field !py-2 text-sm"
            />
            <span className="text-ink-400">—</span>
            <input
              type="number" placeholder="Max" value={filters.maxPrice}
              onChange={(e) => set('maxPrice', e.target.value)}
              className="input-field !py-2 text-sm"
            />
          </div>
        </FilterSection>

        <FilterSection title="Condition">
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={filters.condition === 'all'}
              onClick={() => set('condition', 'all')} label="Any" />
            {conditions.map((c) => (
              <FilterPill key={c} active={filters.condition === c}
                onClick={() => set('condition', c)} label={c.replace('-', ' ')} />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Negotiable">
          <div className="flex gap-1.5">
            <FilterPill active={filters.negotiable === null}
              onClick={() => set('negotiable', null)} label="Any" />
            <FilterPill active={filters.negotiable === true}
              onClick={() => set('negotiable', true)} label="Yes" />
            <FilterPill active={filters.negotiable === false}
              onClick={() => set('negotiable', false)} label="No" />
          </div>
        </FilterSection>

        <FilterSection title="College">
          <select
            value={filters.college}
            onChange={(e) => set('college', e.target.value)}
            className="input-field !py-2 text-sm"
          >
            {colleges.map((c) => <option key={c} value={c === 'All colleges' ? '' : c}>{c}</option>)}
          </select>
        </FilterSection>
      </div>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2.5">{title}</h4>
      {children}
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={cx(
      'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors capitalize',
      active ? 'bg-primary-50 text-primary-700 font-medium' : 'text-ink-600 hover:bg-ink-50'
    )}>
      {label}
    </button>
  );
}

