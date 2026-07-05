import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, MessageCircle, Package, Star, Search, BarChart3,
  Sparkles, ArrowRight, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/data/mockData';

const features = [
  { icon: ShieldCheck, color: 'from-primary-500 to-primary-700',
    title: 'Verified College Students', desc: 'Only students with verified .edu / college emails can join. Safe and trusted.' },
  { icon: MessageCircle, color: 'from-blue-500 to-blue-700',
    title: 'Real-Time Chat & Offers', desc: 'Message instantly. Make, accept, reject, or counter offers in real time.' },
  { icon: Package, color: 'from-amber-500 to-amber-700',
    title: 'Reserve → Meet → Sold', desc: 'Reserve items, meet on campus, and complete the transaction. No shipping headaches.' },
  { icon: Star, color: 'from-pink-500 to-pink-700',
    title: 'Ratings & Trust', desc: 'Rate your experience. Trusted Seller badges for top performers.' },
  { icon: Search, color: 'from-emerald-500 to-emerald-700',
    title: 'Powerful Search & Filters', desc: 'Find exactly what you need. By title, category, price, condition, and more.' },
  { icon: BarChart3, color: 'from-purple-500 to-purple-700',
    title: 'Seller Dashboard', desc: 'Track active listings, sales, earnings, views, and ratings at a glance.' },
];

const steps = [
  { num: '01', title: 'Sign up with college email', desc: 'Verify your .edu address in one click.' },
  { num: '02', title: 'Browse or list items', desc: "Search what you need or sell what you don't." },
  { num: '03', title: 'Chat & negotiate', desc: 'Message sellers, make offers, agree on a price.' },
  { num: '04', title: 'Reserve & meet on campus', desc: 'Reserve the item and meet safely on campus to pay & collect.' },
];

const colleges = ['IIT Delhi', 'IIT Bombay', 'IIIT Delhi', 'DTU', 'BITS Pilani', 'NSUT', 'JNU', 'DU'];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-ink-200 rounded-full px-4 py-1.5 mb-6 shadow-soft">
              <Sparkles size={14} className="text-primary-600" />
              <span className="text-xs font-semibold text-ink-700">Now live on 8+ campuses</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-ink-950 tracking-tight leading-[1.05] mb-6">
              The marketplace
              <br />
              <span className="gradient-text">built for students.</span>
            </h1>
            <p className="text-lg text-ink-600 mb-8 max-w-xl mx-auto">
              Buy, sell, and trade safely with verified students on your campus.
              Chat in real-time, negotiate offers, and meet on campus to complete every deal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup">
                <Button variant="purple" size="lg" iconRight={<ArrowRight size={18} />}>
                  Get started — it's free
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="secondary" size="lg">Browse listings</Button>
              </Link>
            </div>
            <p className="text-xs text-ink-500 mt-4">
              Free forever · Verified .edu emails only · No listing fees
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'Active students', value: '12,400+' },
              { label: 'Items sold', value: '8,200+' },
              { label: 'Campus partners', value: '8' },
              { label: 'Avg. rating', value: '4.8★' },
            ].map((s, i) => (
              <div key={i} className="card p-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-xs text-ink-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-y border-ink-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-ink-500 uppercase tracking-widest mb-6">
            Trusted by students from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {colleges.map((c) => (
              <span key={c} className="text-ink-400 font-semibold text-sm hover:text-ink-700 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-ink-950 tracking-tight mb-3">
              Everything you need to <span className="gradient-text">trade on campus.</span>
            </h2>
            <p className="text-ink-600">From browsing to handoff, every feature designed for the student marketplace.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card p-6 group hover:border-primary-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-soft`}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-ink-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-ink-950 tracking-tight mb-3">
              How it <span className="gradient-text">works.</span>
            </h2>
            <p className="text-ink-600">From sign-up to sold in four simple steps.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <div className="card p-6 h-full">
                  <span className="text-5xl font-extrabold gradient-text">{s.num}</span>
                  <h3 className="text-lg font-semibold text-ink-900 mt-3 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-ink-600">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-ink-300 z-10" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-ink-950 tracking-tight mb-2">Trending on campus</h2>
              <p className="text-ink-600">Fresh listings from students near you.</p>
            </div>
            <Link to="/browse" className="hidden sm:inline-flex btn-secondary">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-ink-950 rounded-3xl p-10 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 dot-bg opacity-30" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-600 rounded-full blur-3xl opacity-30" />
            <div className="relative text-center">
              <Heart className="mx-auto text-primary-400 mb-4" size={32} fill="currentColor" />
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to declutter your dorm?
              </h2>
              <p className="text-ink-300 mb-8 max-w-xl mx-auto">
                Join thousands of students already trading safely on Campus Bazaar.
                List your first item in under 60 seconds.
              </p>
              <Link to="/signup">
                <Button variant="purple" size="lg" iconRight={<ArrowRight size={18} />}>
                  Create your account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
