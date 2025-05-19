import ProviderLogin from '../../components/ProviderLogin';
import React from 'react';

const EXAMPLE_PROVIDERS = [
  {
    id: '1',
    name: 'One Medical',
    logo: '🏥',
    description: 'Primary care provider network'
  },
  {
    id: '2',
    name: 'Kaiser Permanente',
    logo: '⚕️',
    description: 'Integrated managed care consortium'
  },
  {
    id: '3',
    name: 'Stanford Health Care',
    logo: '🏫',
    description: 'Academic medical center'
  },
  {
    id: '4',
    name: 'UCSF Medical Center',
    logo: '🔬',
    description: 'Academic medical center'
  }
];

export default function ProviderLoginPage({ params }: { params: { id: string } }) {
  const provider = EXAMPLE_PROVIDERS.find((p) => p.id === params.id);

  if (!provider) {
    return <div className="container mx-auto px-4 py-8 text-red-600">Provider not found.</div>;
  }

  return <ProviderLogin provider={provider} />;
} 