'use client';

import { useState } from 'react';
import ProviderLogin from './ProviderLogin';

interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const EXAMPLE_PROVIDERS: Provider[] = [
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

export default function ProviderPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  if (selectedProvider) {
    return <ProviderLogin provider={selectedProvider} />;
  }

  const filteredProviders = EXAMPLE_PROVIDERS.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="border rounded-lg shadow-lg p-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold text-black mb-6">Connect to Provider Portal</h1>
          
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your healthcare provider..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg pl-10 focus:outline-none focus:border-teal-500"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black mb-4">Popular Providers</h2>
            {filteredProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider)}
                className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                      {provider.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-1">{provider.name}</h3>
                      <p className="text-gray-600">{provider.description}</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 