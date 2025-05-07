'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceConfirmation from './InvoiceConfirmation';
import CalculationInProgress from './CalculationInProgress';

interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface VisitRecord {
  id: string;
  date: string;
  cptCode: string;
  description: string;
}

interface ProviderLoginProps {
  provider: Provider;
  onBack?: () => void;
  onRestart?: () => void;
}

const EXAMPLE_RECORDS: VisitRecord[] = [
  {
    id: '1',
    date: '2024-03-15',
    cptCode: '99213',
    description: 'Office visit for established patient, moderate complexity'
  },
  {
    id: '2',
    date: '2024-02-28',
    cptCode: '99214',
    description: 'Office visit for established patient, moderate to high complexity'
  },
  {
    id: '3',
    date: '2024-02-10',
    cptCode: '99212',
    description: 'Office visit for established patient, low complexity'
  }
];

export default function ProviderLogin({ provider, onBack, onRestart }: ProviderLoginProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VisitRecord | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState<VisitRecord | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate credentials with the provider's API
    setIsLoggedIn(true);
  };

  if (showCalculation) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-4 bg-white">
        <div className="w-[800px] mx-auto">
          <CalculationInProgress
            expenseNumber="141192"
            userName="Garvin Chen"
            createdDate={new Date().toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
            invoiceData={[
              {
                dateOfService: confirmationPending?.date || new Date().toISOString().split('T')[0],
                drugName: confirmationPending?.description || '',
                ndc: confirmationPending?.cptCode || '',
                amount: '$250.00'
              }
            ]}
            pharmacyName={provider.name}
            onBack={() => setShowCalculation(false)}
            onRestart={onRestart}
          />
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-4 bg-white">
        <div className="w-[800px] mx-auto">
          <InvoiceConfirmation 
            onConfirm={() => setShowCalculation(true)}
            onEdit={() => setShowConfirmation(false)}
          />
        </div>
      </div>
    );
  }

  if (confirmationPending) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="border rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Confirm Visit Selection</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-black mb-2">Selected Visit:</p>
              <p className="text-gray-600">Date: {confirmationPending.date}</p>
              <p className="text-gray-600">CPT Code: {confirmationPending.cptCode}</p>
              <p className="text-gray-600">Description: {confirmationPending.description}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmationPending(null)}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="border rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                  {provider.logo}
                </div>
                <h1 className="text-2xl font-bold text-black">{provider.name}</h1>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>

            <h2 className="text-xl font-semibold text-black mb-4">Recent Visits</h2>
            <div className="space-y-4">
              {EXAMPLE_RECORDS.map((record) => (
                <button
                  key={record.id}
                  onClick={() => setConfirmationPending(record)}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600 mb-2">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-black font-medium mb-1">CPT Code: {record.cptCode}</p>
                      <p className="text-gray-600">{record.description}</p>
                    </div>
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

  return (
    <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="border rounded-lg shadow-lg p-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
              {provider.logo}
            </div>
            <h1 className="text-2xl font-bold text-black">{provider.name}</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Sign In
              </button>
              <a href="#" className="text-teal-600 hover:text-teal-700 text-sm">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 