'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Broker, supabase } from '@/lib/supabase';

// Generate a short random token for PDF access (12 chars = 62^12 combinations)
const PDF_TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generatePdfToken = (): string => {
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += PDF_TOKEN_CHARS.charAt(Math.floor(Math.random() * PDF_TOKEN_CHARS.length));
  }
  return token;
};

// Format phone number as (123) 456-7890
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

// Format experience to avoid leading zeros
const formatExperience = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return 0;
  return parseInt(digits, 10);
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBrokerPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    agence: '',
    agence_photo_url: '',
    equipe: '',
    equipe_photo_url: '',
    title: '',
    photo_url: '',
    phone: '',
    email: '',
    bio: '',
    pdf_url: '',
    pdf_token: '',
    years_experience: 0,
    primary_color: '#1e40af',
    accent_color: '#f59e0b',
  });

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const res = await fetch(`/api/brokers/${id}`);
        if (!res.ok) throw new Error('Broker not found');
        const broker: Broker = await res.json();
        setForm({
          name: broker.name,
          slug: broker.slug,
          agence: broker.agence,
          agence_photo_url: broker.agence_photo_url || '',
          equipe: broker.equipe || '',
          equipe_photo_url: broker.equipe_photo_url || '',
          title: broker.title || '',
          photo_url: broker.photo_url || '',
          phone: broker.phone,
          email: broker.email,
          bio: broker.bio || '',
          pdf_url: broker.pdf_url || '',
          pdf_token: broker.pdf_token || '',
          years_experience: broker.years_experience || 0,
          primary_color: broker.primary_color || '#1e40af',
          accent_color: broker.accent_color || '#f59e0b',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broker');
      } finally {
        setLoading(false);
      }
    };
    fetchBroker();
  }, [id]);

  const uploadPdf = async (file: File, slug: string): Promise<string | null> => {
    const fileName = `${slug}-${Date.now()}.pdf`;
    const { data, error } = await supabase.storage.from('broker-pdfs').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('PDF upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage.from('broker-pdfs').getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let pdfUrl = form.pdf_url;
      let pdfToken = form.pdf_token;

      if (pdfFile) {
        setUploadingPdf(true);
        const uploadedUrl = await uploadPdf(pdfFile, form.slug);
        if (uploadedUrl) {
          pdfUrl = uploadedUrl;
          // Generate a new token when uploading a new PDF
          pdfToken = generatePdfToken();
        }
        setUploadingPdf(false);
      }

      const res = await fetch(`/api/brokers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pdf_url: pdfUrl, pdf_token: pdfToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update broker');
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-gray-200">
            &larr; Back
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Broker</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
        >
          {error && (
            <div className="sticky top-4 z-50 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 shadow-lg">
              <strong>Erreur:</strong> {error}
            </div>
          )}

          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">URL: /broker/{form.slug}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Agence *</label>
                <input
                  type="text"
                  required
                  value={form.agence}
                  onChange={(e) => setForm({ ...form, agence: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Logo Agence (URL)
                </label>
                <input
                  type="url"
                  value={form.agence_photo_url}
                  onChange={(e) => setForm({ ...form, agence_photo_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Équipe</label>
                <input
                  type="text"
                  value={form.equipe}
                  onChange={(e) => setForm({ ...form, equipe: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Logo Équipe (URL)
                </label>
                <input
                  type="url"
                  value={form.equipe_photo_url}
                  onChange={(e) => setForm({ ...form, equipe_photo_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(514) 555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Courriel *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Années d&apos;expérience
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.years_experience === 0 ? '' : form.years_experience}
                onChange={(e) =>
                  setForm({ ...form, years_experience: formatExperience(e.target.value) })
                }
                className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio *</label>
              <textarea
                required
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PDF Guide Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Guide PDF</label>
              {form.pdf_url && (
                <p className="text-sm text-green-400 mb-2">
                  PDF actuel:{' '}
                  <a
                    href={form.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Voir le PDF
                  </a>
                </p>
              )}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPdfFile(file);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
                />
                {pdfFile && <span className="text-sm text-green-400">{pdfFile.name}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Téléverser un nouveau PDF remplacera l&apos;existant
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme Colors</label>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accent_color}
                    onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">Accent</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              <strong>Erreur:</strong> {error}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploadingPdf ? 'Téléversement du PDF...' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
