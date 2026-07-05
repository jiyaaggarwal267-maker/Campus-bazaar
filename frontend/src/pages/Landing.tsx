import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, MessageCircle, Package, Star, Search, BarChart3,
  Sparkles, ArrowRight, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { categories } from '@/data/categories';

const features = [
  {
    icon: ShieldCheck,
    color: 'from-primary-500 to-primary-700',
    title: 'Verified College Students',
    desc: 'Only students with verified college emails can join. Safe and trusted.',
  },
  {
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-700',
    title: 'Real-Time Chat & Offers',
    desc: 'Message instantly. Make, accept, reject, or counter offers in real time.',
  },
  {
    icon: Package,
    color: 'from-amber-500 to-amber-700',
    title: 'Reserve → Meet → Sold',
    desc: 'Reserve items, meet on campus, and complete transactions safely.',
  },
  {
    icon: Star,
    color: 'from-pink-500 to-pink-700',
    title: 'Ratings & Trust',
    desc: 'Rate your experience. Trusted Seller badges for top performers.',
  },
  {
    icon: Search,
    color: 'from-emerald-500 to-emerald-700',
    title: 'Powerful Search & Filters',
    desc: 'Find exactly what you need quickly and easily.',
  },
  {
    icon: BarChart3,
    color: 'from-purple-500 to-purple-700',
    title: 'Seller Dashboard',
    desc: 'Track listings, sales, earnings, and ratings.',
  },
];

const steps = [
  { num: '01', title: 'Sign up with college email', desc: 'Verify your college email in one click.' },
  { num: '02', title: 'Browse or list items', desc: "Search or sell what you don't need." },
  { num: '03', title: 'Chat & negotiate', desc: 'Message sellers and agree on a price.' },
  { num: '04', title: 'Meet on campus', desc: 'Complete safe in-person transactions.' },
];

const colleges = ['IIT Delhi', 'IIT Bombay', 'IIIT Delhi', 'DTU', 'BITS Pilani', 'NSUT', 'JNU', 'DU'];

export default function Landing() {
  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-1.5 mb-6 shadow-soft">
              <Sparkles size={14} className="text-primary-600" />
              <span className="text-xs font-semibold text-ink-700">
                Now live on campuses
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight mb-6">
              The marketplace <br />
              <span className="gradient-text">built for students.</span>
            </h1>

            <p className="text-lg text-ink-600 mb-8 max-w-xl mx-auto">
              Buy, sell, and trade safely with verified students on your campus.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup">
                <Button variant="purple" size="lg" iconRight={<ArrowRight size={18} />}>
                  Get started
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="secondary" size="lg">
                  Browse listings
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Active students', value: '12,400+' },
            { label: 'Items sold', value: '8,200+' },
            { label: 'Campuses', value: '8' },
            { label: 'Rating', value: '4.8★' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COLLEGES */}
      <section className="py-10 border-y">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-ink-500">
          {colleges.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <f.icon className="mb-3 text-primary-600" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-ink-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Trending</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((c: string, i: number) => (
              <ProductCard key={c} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <Heart className="mx-auto mb-4 text-primary-500" />
        <h2 className="text-4xl font-bold mb-4">Ready to start?</h2>
        <Link to="/signup">
          <Button variant="purple" size="lg">
            Create account
          </Button>
        </Link>
      </section>

    </div>
  );
}