import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent, type DragEvent } from 'react';

import { supabase } from '../../lib/supabaseClient';

import { toast } from 'sonner';
import { AlertCircle, CheckCircle, ImagePlus, X } from 'lucide-react';

import { useUser } from '../../context/UserContext';
import { uid } from '../../utils/uid';
import { validateProductForm } from '../../utils/validators';
import type { FieldErrors, ProductForm } from '../../types/types';

import type { LicenseCategory, SilhouetteCategory } from '../../components/catalog-home/types';

import styles from './CreateProduct.module.css';

const BUCKET = 'motorcycle-photos';
const MAX_FILES = 8;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}


const SILHOUETTE_OPTIONS: SilhouetteCategory[] = [
  'naked', 'sport', 'adventure', 'scrambler', 'electric', 'cruiser',
];

const LICENSE_OPTIONS: LicenseCategory[] = ['A', 'A2', 'A1', 'B'];

const CURRENT_YEAR = new Date().getFullYear();

const emptyForm: ProductForm = {
  name: '',
  model: '',
  brand: '',
  year: '',
  color: '',
  powerKw: '',
  engine: '',
  price: '',
  inStock: true,

  licenseCategories: [],
  silhouetteCategory: '',
};

const inputClass =
  'bg-white/5 border border-white/20 focus:border-amber-400 outline-none text-white placeholder:text-white/30 w-full px-4 py-2.5 rounded-lg transition-colors duration-200';

const labelClass =
  'block text-white/80 text-sm font-semibold uppercase tracking-wider mb-1.5';

const errorClass = 'text-red-400 text-xs mt-1 flex items-center gap-1';

export default function CreateProduct() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => { photos.forEach(p => URL.revokeObjectURL(p.preview)); };
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid = arr.filter(f => ACCEPTED.includes(f.type));
    if (valid.length < arr.length) {
      toast.error('Only JPEG, PNG, WebP, and AVIF images are accepted.');
    }
    setPhotos(prev => {
      const remaining = MAX_FILES - prev.length;
      if (remaining <= 0) return prev;
      const toAdd = valid.slice(0, remaining).map(file => ({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  }, []);

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleLicense = (cat: LicenseCategory) => {
    setForm(f => {
      const current = f.licenseCategories;
      const isActive = current.includes(cat);

      let next: LicenseCategory[];
      if (isActive) {
        // Deselecting A also removes A1 and A2; deselecting A2 also removes A1
        if (cat === 'A') next = current.filter(c => c !== 'A' && c !== 'A1' && c !== 'A2');
        else if (cat === 'A2') next = current.filter(c => c !== 'A2' && c !== 'A1');
        else next = current.filter(c => c !== cat);
      } else {
        // Selecting A adds A1 and A2; selecting A2 adds A1
        if (cat === 'A') next = [...new Set<LicenseCategory>([...current, 'A', 'A1', 'A2'])];
        else if (cat === 'A2') next = [...new Set<LicenseCategory>([...current, 'A2', 'A1'])];
        else next = [...current, cat];
      }

      return { ...f, licenseCategories: next };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (photos.length < 2) {
      toast.error('Please upload at least 2 photos before submitting.');
      return;
    }

    if (form.licenseCategories.length === 0) {
      toast.error('Please select at least one license category.');
      return;
    }

    const errors = validateProductForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    // Generate a product ID upfront so photos live under {productId}/filename
    const productId = crypto.randomUUID();

    // Upload photos to motorcycle-photos/{productId}/
    const uploadedUrls: string[] = [];
    for (const photo of photos) {
      const ext = photo.file.name.split('.').pop();
      const path = `${productId}/${uid()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, photo.file, { contentType: photo.file.type, upsert: false });

      if (error) {
        toast.error(`Photo upload failed: ${error.message}`);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploadedUrls.push(urlData.publicUrl);
    }

    // Insert the listing into the motorcycles table
    const { error: insertError } = await supabase.from('motorcycles').insert({
      id: productId,
      user_id: user!.id,
      name: form.name,
      brand: form.brand,
      model: form.model,
      year: Number(form.year),
      color: form.color,
      engine: form.engine,
      power_kw: Number(form.powerKw),
      price: Number(form.price),
      in_stock: form.inStock,
      license_categories: form.licenseCategories,
      silhouette_category: form.silhouetteCategory,
      photo_urls: uploadedUrls,
    });

    if (insertError) {
      toast.error(`Failed to save listing: ${insertError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    photos.forEach(p => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setForm(emptyForm);
    setFieldErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <main className={`${styles.pageWrapper} min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-6`}>
        <div className={`reveal-item${visible ? ' is-visible' : ''} text-center`}>
          <CheckCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-white font-serif mb-2">Listing Created!</h2>
          <p className="!text-amber-400 font-semibold mb-8">Your motorcycle listing has been submitted successfully.</p>
          <button
            onClick={handleReset}
            className="bg-amber-400 text-gray-900 font-semibold uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-amber-300 transition-colors duration-200"
          >
            Add Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`${styles.pageWrapper} min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-6`}>
      <div className="max-w-2xl mx-auto pb-16">

        <div className={`reveal-item${visible ? ' is-visible' : ''} mb-10`}>
          <h1 className="text-4xl font-bold text-white font-serif">Create Listing</h1>
          <p className="text-white/50 mt-2 text-sm">Fill in the details to add a new motorcycle.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className={`reveal-item${visible ? ' is-visible' : ''} space-y-6`}
          style={{ transitionDelay: '0.1s' }}
        >

          {/* Name & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g. CF 700 CL-X"
                value={form.name}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.name ? ' border-red-500' : ''}`}
              />
              {fieldErrors.name && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <input
                name="model"
                type="text"
                placeholder="e.g. CL-X"
                value={form.model}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.model ? ' border-red-500' : ''}`}
              />
              {fieldErrors.model && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.model}</p>
              )}
            </div>
          </div>

          {/* Brand & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Brand</label>
              <input
                name="brand"
                type="text"
                placeholder="e.g. CFMOTO"
                value={form.brand}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.brand ? ' border-red-500' : ''}`}
              />
              {fieldErrors.brand && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.brand}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <input
                name="year"
                type="number"
                placeholder={String(CURRENT_YEAR)}
                min={1900}
                max={CURRENT_YEAR + 1}
                value={form.year}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.year ? ' border-red-500' : ''}`}
              />
              {fieldErrors.year && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.year}</p>
              )}
            </div>
          </div>

          {/* Color & Engine */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Color</label>
              <input
                name="color"
                type="text"
                placeholder="e.g. Midnight Black"
                value={form.color}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.color ? ' border-red-500' : ''}`}
              />
              {fieldErrors.color && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.color}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Engine</label>
              <input
                name="engine"
                type="text"
                placeholder="e.g. 693cc Parallel Twin"
                value={form.engine}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.engine ? ' border-red-500' : ''}`}
              />
              {fieldErrors.engine && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.engine}</p>
              )}
            </div>
          </div>

          {/* Power & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Power (kW)</label>
              <input
                name="powerKw"
                type="number"
                placeholder="e.g. 55"
                min={1}
                value={form.powerKw}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.powerKw ? ' border-red-500' : ''}`}
              />
              {fieldErrors.powerKw && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.powerKw}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Price (€)</label>
              <input
                name="price"
                type="number"
                placeholder="e.g. 9990"
                min={1}
                value={form.price}
                onChange={handleChange}
                className={`${inputClass}${fieldErrors.price ? ' border-red-500' : ''}`}
              />
              {fieldErrors.price && (
                <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.price}</p>
              )}
            </div>
          </div>

          {/* Silhouette Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              name="silhouetteCategory"
              value={form.silhouetteCategory}
              onChange={handleChange}
              className={`${inputClass}${fieldErrors.silhouetteCategory ? ' border-red-500' : ''} cursor-pointer`}
            >
              <option value="" disabled className="bg-gray-900">Select a category</option>
              {SILHOUETTE_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-gray-900 capitalize">
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            {fieldErrors.silhouetteCategory && (
              <p className={errorClass}><AlertCircle className="w-3 h-3" />{fieldErrors.silhouetteCategory}</p>
            )}
          </div>

          {/* License Categories */}
          <div>
            <label className={labelClass}>License Categories</label>
            <div className="flex gap-3 flex-wrap mt-1">
              {LICENSE_OPTIONS.map(cat => {
                const active = form.licenseCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleLicense(cat)}
                    className={`px-5 py-2 rounded-lg border text-sm font-semibold tracking-wide transition-colors duration-200 ${
                      active
                        ? 'bg-amber-400 border-amber-400 text-gray-900'
                        : 'bg-white/5 border-white/20 text-white/60 hover:border-amber-400/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-3">
            <input
              id="inStock"
              name="inStock"
              type="checkbox"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />
            <label htmlFor="inStock" className="text-white/80 text-sm font-semibold uppercase tracking-wider cursor-pointer">
              In Stock
            </label>
          </div>

          {/* ── Photos ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass} style={{ marginBottom: 0 }}>Photos</label>
              <span className="text-white/30 text-xs">{photos.length} / {MAX_FILES}</span>
            </div>

            {/* Drop zone */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload photos"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors duration-200 select-none ${
                dragging
                  ? 'border-amber-400 bg-amber-400/5'
                  : 'border-white/20 bg-white/[0.03] hover:border-amber-400/50 hover:bg-white/[0.05]'
              } ${photos.length >= MAX_FILES ? 'pointer-events-none opacity-40' : ''}`}
            >
              <ImagePlus className="w-7 h-7 text-amber-400/70" strokeWidth={1.5} />
                <span className="text-amber-400 font-medium"> Drag & drop photos here, or browse</span>
              <p className="!text-amber-400">JPEG, PNG, WebP, AVIF — up to {MAX_FILES} photos</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              multiple
              className="hidden"
              onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Preview grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square bg-white/5">
                    <img
                      src={photo.preview}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-amber-400 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gray-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 text-gray-900 font-semibold uppercase tracking-widest py-3 rounded-lg hover:bg-amber-300 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>

        </form>
      </div>
    </main>
  );
}
