'use client';

import { Broker } from '@/lib/supabase';
import Image from 'next/image';

interface BrokerLandingProps {
  broker: Broker;
}

export default function BrokerLanding({ broker }: BrokerLandingProps) {
  const primaryColor = broker.primary_color || '#1e40af';
  const accentColor = broker.accent_color || '#f59e0b';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="text-white py-16 px-4" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gray-200">
            {broker.photo_url ? (
              <Image
                src={broker.photo_url}
                alt={broker.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {broker.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{broker.name}</h1>
            <p className="text-xl opacity-90">{broker.title}</p>
            <p className="text-lg opacity-80">{broker.company}</p>
            {broker.license_number && (
              <p className="text-sm opacity-70 mt-2">License #{broker.license_number}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Contact Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
            Contact Me
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href={`tel:${broker.phone}`}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{broker.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${broker.email}`}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{broker.email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">{broker.bio}</p>
          {broker.years_experience > 0 && (
            <div className="mt-6 flex items-center gap-2">
              <span
                className="px-4 py-2 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: accentColor }}
              >
                {broker.years_experience}+ Years Experience
              </span>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
            My Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'First-Time Home Buyers',
              'Refinancing',
              'Investment Properties',
              'Pre-Approval',
              'Mortgage Renewal',
              'Debt Consolidation',
            ].map((service) => (
              <div key={service} className="flex items-center gap-3 p-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: accentColor }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="rounded-xl p-8 text-center text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 opacity-90">
            Let me help you find the perfect mortgage solution for your needs.
          </p>
          <a
            href={`tel:${broker.phone}`}
            className="inline-block px-8 py-3 rounded-full font-semibold transition hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            Call Now
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold">{broker.name}</p>
          <p className="text-gray-400">{broker.company}</p>
          <p className="text-sm text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
