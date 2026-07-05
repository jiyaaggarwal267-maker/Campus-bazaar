import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { colleges } from '@/data/colleges';

const years = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Postgraduate',
  'PhD',
];

const interests = [
  'Textbooks',
  'Electronics',
  'Cycles',
  'Furniture',
  'Sports',
  'Music',
  'Clothing',
  'Notes',
];

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string[]>(user?.interests || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
  } = useForm<{
    name: string;
    college: string;
    year: string;
    bio: string;
  }>({
    defaultValues: {
      name: user?.name || '',
      college: user?.college || '',
      year: user?.year || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data: any) => {
    setError('');

    if (!data.college) {
      setError('Please select your college.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        ...data,
        interests: selected,
      });

      navigate('/browse');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50/50 py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink-950 mb-2">
            Complete your profile
          </h1>

          <p className="text-ink-600">
            Choose your college so we can show listings from your campus.
          </p>
        </div>

        <div className="card p-8">
          <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size={96}
                className="!ring-4 !ring-white shadow-soft-md"
              />

              <div className="absolute inset-0 rounded-full bg-ink-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={20} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Input
              label="Display name"
              {...register('name', {
                required: true,
              })}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-800 mb-1.5">
                  College
                </label>

                <select
                  {...register('college', {
                    required: true,
                  })}
                  className="input-field"
                >
                  <option value="">Select your college</option>

                  {colleges.map((college) => (
                    <option
                      key={college}
                      value={college}
                    >
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-800 mb-1.5">
                  Year
                </label>

                <select
                  {...register('year', {
                    required: true,
                  })}
                  className="input-field"
                >
                  <option value="">Select year</option>

                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-800 mb-1.5">
                Bio
                <span className="text-ink-400 font-normal">
                  {' '}
                  (optional)
                </span>
              </label>

              <textarea
                {...register('bio')}
                rows={3}
                placeholder="CS student. Love buying and selling tech."
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-800 mb-2">
                Interests
              </label>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selected.includes(interest)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-ink-700 border-ink-200 hover:border-primary-300'
                    }`}
                  >
                    {selected.includes(interest) && (
                      <Check size={12} className="inline mr-1" />
                    )}

                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="purple"
                loading={loading}
                fullWidth
              >
                Complete Profile
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}