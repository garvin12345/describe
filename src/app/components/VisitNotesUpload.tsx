'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EditableInvoiceTable from './EditableInvoiceTable';
import CalculationInProgress from './CalculationInProgress';

interface InvoiceItem {
  dateOfService: string;
  drugName: string;
  ndc: string;
  amount: string;
}

interface VisitNotesUploadProps {
  onBack?: () => void;
  onRestart?: () => void;
}

export default function VisitNotesUpload({ onBack, onRestart }: VisitNotesUploadProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showInvoiceTable, setShowInvoiceTable] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = (data: InvoiceItem[], pharmacyName: string) => {
    setShowCalculation(true);
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
                dateOfService: new Date().toISOString().split('T')[0],
                drugName: 'Provider Fee for the Therapy Session',
                ndc: '99213',
                amount: '$250.00'
              }
            ]}
            pharmacyName="Medical Provider"
            onBack={() => setShowCalculation(false)}
            onRestart={onRestart}
          />
        </div>
      </div>
    );
  }

  if (showInvoiceTable) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-4 bg-white">
        <div className="w-[800px] mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-black">
              Enter Visit Information
            </h2>
            <EditableInvoiceTable
              initialData={[
                {
                  dateOfService: new Date().toISOString().split('T')[0],
                  drugName: 'Provider Fee for the Therapy Session',
                  ndc: '',
                  amount: ''
                }
              ]}
              onSave={handleSave}
              onCancel={() => setShowInvoiceTable(false)}
            />
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

          <h1 className="text-3xl font-bold text-black mb-6">Upload Visit Notes</h1>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h2>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start gap-2">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Upload your provider's visit notes that include diagnosis and treatment details</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Make sure the notes include the date of service, provider name, and your name</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Files must be in PDF, JPG, PNG, or GIF format (max 30MB)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
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
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  Drag and drop your file here or{' '}
                  <button onClick={handleBrowseClick} className="text-teal-500 hover:text-teal-600 font-medium">
                    browse files
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Supported formats: PDF, JPG, PNG, GIF (max 30MB)
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowInvoiceTable(true)}
              disabled={!selectedFile}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                selectedFile
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Visit Notes
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