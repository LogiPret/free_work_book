'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PdfRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerId: string;
  brokerName: string;
  primaryColor: string;
  accentColor: string;
}

export default function PdfRequestModal({
  isOpen,
  onClose,
  brokerId,
  brokerName,
  primaryColor,
}: PdfRequestModalProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/pdf-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brokerId,
          brokerName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleClose = () => {
    setFormData({ prenom: '', nom: '', telephone: '' });
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <svg
                  className="h-8 w-8"
                  style={{ color: primaryColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Demande envoyée!</h3>
              <p className="mt-2 text-gray-600">
                Vous recevrez le guide par SMS dans quelques instants.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recevoir le guide gratuit</h2>
              <p className="text-gray-600 mb-6">
                Entrez vos informations pour recevoir le guide par SMS.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 focus:outline-none"
                    style={{ ['--tw-ring-color' as string]: primaryColor }}
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 focus:outline-none"
                    style={{ ['--tw-ring-color' as string]: primaryColor }}
                    placeholder="Tremblay"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 focus:outline-none"
                    style={{ ['--tw-ring-color' as string]: primaryColor }}
                    placeholder="(514) 555-1234"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {status === 'loading' ? 'Envoi en cours...' : 'Recevoir le guide'}
                </button>
              </form>

              <p className="mt-4 text-xs text-center text-gray-500">
                En soumettant ce formulaire, vous acceptez de recevoir le guide par SMS.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
