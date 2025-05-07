'use client';

import { useState, useRef } from 'react';
import Chat from './Chat';
import InvoiceConfirmation from './InvoiceConfirmation';
import CalculationInProgress from './CalculationInProgress';

interface ClaimStartProps {
  accessType?: 'expense' | 'direct';
}

export default function ClaimStart({ accessType = 'direct' }: ClaimStartProps) {
  const [showChat, setShowChat] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const [careType, setCareType] = useState('medical');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (showChat) {
    return <Chat />;
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
                dateOfService: new Date().toISOString().split('T')[0],
                drugName: 'Prescription Medication',
                ndc: '00000-000-00',
                amount: '$250.00'
              }
            ]}
            pharmacyName="Pharmacy"
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

  return (
    <div className="container mx-auto px-4 min-h-screen py-4 bg-white">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="w-[800px]">
          <div className="border rounded-lg shadow-lg p-8 min-h-[800px]">
            <h1 className="text-2xl font-bold mb-8 text-black">Submit claim documents by Nov 20, 2025</h1>
            
            <div className="mb-8">
              <h2 className="text-lg mb-4 text-black">What type of care is this for?</h2>
              <div className="flex gap-4">
                <button 
                  className={`px-6 py-2 rounded-lg border-2 ${
                    careType === 'medical' 
                      ? 'border-teal-500 text-teal-500' 
                      : 'border-gray-300 text-black'
                  }`}
                  onClick={() => setCareType('medical')}
                >
                  Medical
                </button>
                <button 
                  className={`px-6 py-2 rounded-lg border-2 ${
                    careType === 'pharmacy' 
                      ? 'border-teal-500 text-teal-500' 
                      : 'border-gray-300 text-black'
                  }`}
                  onClick={() => setCareType('pharmacy')}
                >
                  Pharmacy
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg mb-4 text-black">Attach itemized invoices</h2>
              
              {/* Required Info Container */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-medium mb-4 text-black text-sm">Provide the required info:</h3>
                <ul className="space-y-2 mb-3 text-sm">
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Patient name
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Provider name or National Provider ID (NPI)
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Date(s) of service
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Procedure codes (CPT, HCPCS, ASC, APC or DRG) for the services
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Diagnosis codes (ICD-10) for the services
                  </li>
                  <li className="flex items-center gap-2 text-black">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Amount charged for each service
                  </li>
                </ul>

                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-black text-sm">Do not upload:</h3>
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Multiple invoices in a single photo
                  </div>
                </div>

                <button className="text-teal-500 hover:text-teal-600 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                  </svg>
                  See example invoices
                </button>
              </div>

              {/* File Upload Container */}
              <div className="bg-gray-50 rounded-lg p-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {selectedFile ? (
                    <div className="mb-4">
                      <p className="text-black mb-2">Selected file: {selectedFile.name}</p>
                      {selectedFile.type.startsWith('image/') && (
                        <img 
                          src={URL.createObjectURL(selectedFile)} 
                          alt="Selected file preview" 
                          className="max-w-full h-auto mx-auto"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 text-black">
                      Drag file here or <button onClick={handleBrowseClick} className="text-teal-500 hover:text-teal-600">browse file</button>
                    </div>
                  )}
                  <div className="text-sm text-black">
                    File type: jpg, gif, png or pdf (30MB max)
                  </div>
                </div>
              </div>
            </div>

            {accessType === 'direct' && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
                >
                  Or create claim without invoice
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[360px]">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <button 
              className={`w-full font-medium px-6 py-3 rounded-lg flex items-center justify-between ${
                selectedFile 
                  ? 'bg-teal-500 text-white hover:bg-teal-600' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedFile}
              onClick={() => setShowConfirmation(true)}
            >
              Submit Invoices
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {accessType === 'direct' && (
              <button
                onClick={() => setShowChat(true)}
                className="w-full text-teal-600 hover:text-teal-700 text-center mt-4"
              >
                Don't have an invoice? Create claim manually
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium text-black mb-4">Have questions?</h2>
            <div className="space-y-3">
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  New message
                </div>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  Chat now
                </div>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Call 855-460-2494
                </div>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 