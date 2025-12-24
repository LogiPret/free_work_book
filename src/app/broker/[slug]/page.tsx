import { getBrokerBySlug, getAllBrokers } from '@/lib/brokers';
import BrokerLanding from '@/components/BrokerLanding';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBrokerBySlug(slug);

  if (!broker) {
    return {
      title: 'Broker Not Found',
    };
  }

  return {
    title: `${broker.name} - ${broker.company}`,
    description: broker.bio?.slice(0, 160),
    openGraph: {
      title: `${broker.name} - Mortgage Broker`,
      description: broker.bio?.slice(0, 160),
      images: broker.photo_url ? [broker.photo_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const brokers = await getAllBrokers();
  return brokers.map((broker) => ({
    slug: broker.slug,
  }));
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BrokerPage({ params }: PageProps) {
  const { slug } = await params;
  const broker = await getBrokerBySlug(slug);

  if (!broker) {
    notFound();
  }

  return <BrokerLanding broker={broker} />;
}
