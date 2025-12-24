'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Generate a secure random token for PDF access
const generatePdfToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    )
    .join('-');
};

export default function NewBrokerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    title: 'Courtier hypothécaire',
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: generateSlug(name),
    });
  };

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

    // Get public URL
    const { data: urlData } = supabase.storage.from('broker-pdfs').getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let pdfUrl = form.pdf_url;
      let pdfToken = form.pdf_token;

      // Upload PDF if a file was selected
      if (pdfFile) {
        setUploadingPdf(true);
        const uploadedUrl = await uploadPdf(pdfFile, form.slug);
        if (uploadedUrl) {
          pdfUrl = uploadedUrl;
          // Generate a new token for the PDF
          pdfToken = generatePdfToken();
        }
        setUploadingPdf(false);
      }

      const res = await fetch('/api/brokers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pdf_url: pdfUrl, pdf_token: pdfToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create broker');
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-gray-200">
            &larr; Back
          </Link>
          <h1 className="text-3xl font-bold text-white">Add New Broker</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
        >
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="john-smith"
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL: /broker/{form.slug || 'your-slug'}
                </p>
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Groupe Hypothécaire ABC"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Équipe Tremblay"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Courtier hypothécaire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="courtier@agence.ca"
                />
              </div>
            </div>

            {/* Years Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Années d&apos;expérience
              </label>
              <input
                type="number"
                min="0"
                value={form.years_experience}
                onChange={(e) =>
                  setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })
                }
                className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tell potential clients about yourself..."
              />
            </div>

            {/* PDF Guide Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Guide PDF</label>
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
                Le PDF sera envoyé par SMS aux demandeurs
              </p>
            </div>

            {/* Theme Colors */}
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

          {/* Submit */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploadingPdf
                ? 'Téléversement du PDF...'
                : loading
                  ? 'Création...'
                  : 'Créer le courtier'}
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
