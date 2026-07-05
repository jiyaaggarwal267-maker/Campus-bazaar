import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(''); setLoading(true);
    try {
      await login(data.email, data.password);
      const from = (location.state as any)?.from?.pathname || '/browse';
      navigate(from, { replace: true });
    } catch (e: any) {
      setError(e.response?.data?.error || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-ink-950 mb-1">Welcome back</h1>
          <p className="text-ink-500 text-sm mb-8">Log in to continue trading on campus.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="College email" type="email" placeholder="you@college.edu" icon={<Mail size={16} />}
              {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Input label="Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" icon={<Lock size={16} />}
              iconRight={<button type="button" onClick={() => setShowPwd((s) => !s)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>}
              {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
            <Button type="submit" variant="purple" fullWidth size="lg" loading={loading}
              iconRight={!loading && <ArrowRight size={16} />}>Log in</Button>
          </form>

          <p className="text-center text-sm text-ink-600 mt-8">
            New to Campus Bazaar?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">Create an account</Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:flex flex-1 bg-ink-950 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white mx-auto mb-6 shadow-glow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">The student marketplace, reimagined.</h2>
          <p className="text-ink-300">Verified .edu emails, real-time chat, secure campus meetups.</p>
        </div>
      </div>
    </div>
  );
}
