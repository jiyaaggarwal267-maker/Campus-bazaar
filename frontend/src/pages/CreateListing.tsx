import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/mockData';
import { conditionLabels } from '@/data/types';
import { uploadAPI } from '@/lib/api';

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct } = useApp();

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [condition, setCondition] = useState('good');
  const [negotiable, setNegotiable] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    title: string;
    description: string;
    price: string;
    category: string;
  }>();

  // ---------------- IMAGE UPLOAD ----------------
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const fd = new FormData();

      files.forEach((file) => {
        fd.append('images', file);
      });

      const { urls } = await uploadAPI.images(fd);

      setImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- CREATE PRODUCT ----------------
  const onSubmit = async (data: any) => {
    setError('');

    if (!user?.college) {
      setError('Please complete your profile and select your college first.');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        condition,
        negotiable,
        college: user.college,
        images,
      };

      await addProduct(payload);

      navigate('/my-listings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-3xl font-bold text-ink-950 mb-1">
        List an item for sale
      </h1>

      <p className="text-ink-500 text-sm mb-8">
        Add some details and reach thousands of students on your campus.
      </p>

      {!user?.college && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
          Please complete your profile and choose your college before creating a listing.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-6 sm:p-8 space-y-6"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* ---------------- PHOTOS ---------------- */}

        <div>
          <label className="block text-sm font-medium text-ink-800 mb-2">
            Photos
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-ink-100 group"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>

                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-[10px] px-2 py-1 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {images.length < 6 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-ink-300 flex flex-col justify-center items-center gap-2 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                {uploading ? (
                  <span className="text-xs">Uploading...</span>
                ) : (
                  <>
                    <Plus size={22} />
                    <span className="text-xs">Add Photo</span>
                  </>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <p className="text-xs text-ink-500 mt-2 flex items-center gap-2">
            <ImageIcon size={12} />
            Upload up to 6 photos.
          </p>
        </div>

        {/* ---------------- TITLE ---------------- */}

        <Input
          label="Title"
          placeholder="MacBook Air M2"
          {...register('title', {
            required: 'Title is required',
          })}
          error={errors.title?.message}
        />

        {/* ---------------- DESCRIPTION ---------------- */}

        <div>
          <label className="block text-sm font-medium text-ink-800 mb-2">
            Description
          </label>

          <textarea
            rows={5}
            className="input-field resize-none"
            placeholder="Describe your item..."
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Minimum 20 characters',
              },
            })}
          />

          {errors.description && (
            <p className="text-red-600 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* ---------------- CATEGORY & CONDITION ---------------- */}

        <div className="grid sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-ink-800 mb-2">
              Category
            </label>

            <select
              {...register('category', { required: true })}
              className="input-field"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-800 mb-2">
              Condition
            </label>

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(conditionLabels).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCondition(key)}
                  className={`rounded-lg border py-2 text-xs font-medium transition ${
                    condition === key
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-ink-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- PRICE ---------------- */}

        <Input
          label="Price (₹)"
          type="number"
          {...register('price', {
            required: 'Price is required',
          })}
          error={errors.price?.message}
        />

        {/* ---------------- NEGOTIABLE ---------------- */}

        <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={(e) => setNegotiable(e.target.checked)}
          />

          <div>
            <p className="font-medium">Open to Offers</p>
            <p className="text-xs text-ink-500">
              Buyers can negotiate with you.
            </p>
          </div>
        </label>

        {/* ---------------- BUTTONS ---------------- */}

        <div className="pt-4 border-t flex gap-3">

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="purple"
            loading={loading}
            disabled={!user?.college}
            fullWidth
          >
            <Upload size={16} />
            Publish Listing
          </Button>

        </div>

      </form>
    </div>
  );
}