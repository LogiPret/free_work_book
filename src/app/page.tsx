import Link from 'next/link';
import { getAllBrokers } from '@/lib/brokers';

export const revalidate = 60;

export default async function Home() {
  const brokers = await getAllBrokers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Mortgage Broker Directory</h1>
          <p className="text-xl text-blue-100">Find your trusted mortgage professional</p>
        </header>

        {brokers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {brokers.map((broker) => (
              <Link
                key={broker.id}
                href={`/broker/${broker.slug}`}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: broker.primary_color || '#1e40af' }}
                  >
                    {broker.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{broker.name}</h2>
                    <p className="text-gray-600">{broker.company}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur rounded-xl p-12 text-center">
            <p className="text-white text-lg mb-4">No brokers yet</p>
            <p className="text-blue-200">Add your first broker via the admin panel</p>
          </div>
        )}

        <div className="text-center mt-16">
          <Link href="/admin" className="text-blue-200 hover:text-white transition text-sm">
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
