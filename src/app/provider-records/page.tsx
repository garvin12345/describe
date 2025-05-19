'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Record {
  id: string;
  patientName: string;
  dateOfService: string;
  service: string;
  status: string;
}

export default function ProviderRecordsPage() {
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const records: Record[] = [
    {
      id: '1',
      patientName: 'John Doe',
      dateOfService: '2024-03-15',
      service: 'Annual Checkup',
      status: 'Pending Confirmation'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      dateOfService: '2024-03-14',
      service: 'Follow-up Visit',
      status: 'Pending Confirmation'
    }
  ];

  const handleConfirm = async () => {
    if (!selectedRecord) {
      alert('Please select a record to confirm');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/calculation-in-progress');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Provider Records
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Please select and confirm a record:</p>
            </div>
            <div className="mt-5">
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-md cursor-pointer transition-colors ${
                      selectedRecord === record.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedRecord(record.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedRecord === record.id}
                        onChange={() => setSelectedRecord(record.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">{record.patientName}</h4>
                        <p className="text-sm text-gray-500">Date of Service: {record.dateOfService}</p>
                        <p className="text-sm text-gray-500">Service: {record.service}</p>
                        <p className="text-sm text-gray-500">Status: {record.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selectedRecord || isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !selectedRecord || isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isLoading ? 'Processing...' : 'Confirm Selected Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 