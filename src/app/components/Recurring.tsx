'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Beginning from './Beginning';
import InvoiceConfirmation from './InvoiceConfirmation';
import CalculationInProgress from './CalculationInProgress';

interface PreviousClaim {
  id: string;
  date: string;
  status: string;
  amount: string;
  provider: string;
  cptCode: string;
}

const PREVIOUS_CLAIMS: PreviousClaim[] = [
  {
    id: '1',
    date: 'Mar 15, 2024',
    status: 'Closed',
    amount: '$150',
    provider: 'Dr. Leean',
    cptCode: '99213'
  }
];

interface RecurringProps {
  onRestart?: () => void;
}

export default function Recurring({ onRestart }: RecurringProps) {
  const router = useRouter();
  const [showBeginning, setShowBeginning] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  if (showBeginning) {
    return <Beginning onRestart={onRestart} />;
  }

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
                dateOfService: selectedDate,
                drugName: 'Provider Fee for the Therapy Session',
                ndc: '99213',
                amount: '$150.00'
              }
            ]}
            pharmacyName="Dr. Leean"
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
            onUpload={() => setShowBeginning(true)}
          />
        </div>
      </div>
    );
  }

  if (showDatePicker) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="border rounded-lg shadow-lg p-8">
            <button
              onClick={() => setShowDatePicker(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="text-3xl font-bold text-black mb-6">When was your visit?</h1>
            
            <div className="mb-8">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Service
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!selectedDate}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  selectedDate
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
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
          <h1 className="text-3xl font-bold text-black mb-6">Recurring Claim</h1>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-800">
                We noticed you've previously visited Dr. Leean for $150. Would you like to submit a recurring claim?
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {PREVIOUS_CLAIMS.map((claim) => (
              <div key={claim.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Provider Fee for the Therapy Session</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">{claim.provider}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{claim.date}</span>
                    </div>
                    <div className="text-sm text-gray-500">CPT Code: {claim.cptCode}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{claim.amount}</div>
                    <div className="text-sm text-green-600">{claim.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDatePicker(true)}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
            >
              Yes, it's a recurring claim
            </button>
            <button
              onClick={() => setShowBeginning(true)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              No, submit a new claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 