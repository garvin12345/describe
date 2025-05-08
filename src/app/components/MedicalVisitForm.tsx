'use client';

import { useState } from 'react';

interface MedicalVisitFormProps {
  onSubmit: (formData: {
    description: string;
    patientName: string;
    dateOfBirth: string;
    providerName: string;
    providerAddress: string;
    locationType: string;
    reasonForNoInvoice: string;
    providerSpecialty: string;
    dateOfService: string;
    chargeAmount: string;
  }) => void;
}

export default function MedicalVisitForm({ onSubmit }: MedicalVisitFormProps) {
  const [description, setDescription] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [locationType, setLocationType] = useState('');
  const [reasonForNoInvoice, setReasonForNoInvoice] = useState('');
  const [providerSpecialty, setProviderSpecialty] = useState('');
  const [dateOfService, setDateOfService] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // Hardcoded values
  const patientName = 'Garvin Chen';
  const dateOfBirth = '1980-05-29';
  const chargeAmount = '350';

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    setCharacterCount(text.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      patientName,
      dateOfBirth,
      providerName,
      providerAddress,
      locationType,
      reasonForNoInvoice,
      providerSpecialty,
      dateOfService,
      chargeAmount,
    });
  };

  const isFormValid = () => {
    return description.length >= 20;
  };

  return (
    <div className="max-w-3xl mx-auto p-2">
      {/* Progress Indicator - made more compact */}
      <div className="flex items-center justify-center mb-2 pt-2">
        {/* Step 1: Describe Visit (completed, number 1) */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white bg-teal-500">
            1
          </div>
          <span className="mt-1 text-xs font-medium text-teal-700">Describe Visit</span>
        </div>
        <div className="flex-1 h-0.5 bg-teal-500 mx-2" />
        {/* Step 2: Add Details (not filled, like step 3) */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-gray-400 border-2 border-gray-300 bg-white">2</div>
          <span className="mt-1 text-xs font-medium text-gray-400">Add Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        {/* Step 3: Review & Submit (upcoming) */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-gray-400 border-2 border-gray-300 bg-white">3</div>
          <span className="mt-1 text-xs font-medium text-gray-400">Review & Submit</span>
        </div>
      </div>

      {/* Reduced space between progress indicator and heading */}
      <h1 className="text-xl font-semibold mb-1 mt-4">Describe your visit</h1>

      <form onSubmit={handleSubmit}>
        {/* Card for description and date of service */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3 border border-gray-100">
          <div className="mb-2">
            <label className="block mb-1">
              <span className="text-gray-900 font-medium">Please describe your visit and all services that were performed</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe what happened during your visit, including any tests, procedures, or treatments..."
              value={description}
              onChange={handleDescriptionChange}
            />
            <div className="flex justify-between text-xs mt-1">
              {characterCount < 20 ? (
                <span className="text-orange-500">At least {20 - characterCount} more characters required</span>
              ) : (
                <span className="text-gray-500">✓ Minimum length met</span>
              )}
              <span className="text-gray-500">{characterCount} / 20+ characters</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-900 font-medium mb-1 text-sm">Date of Service</label>
            <input
              type="date"
              className="w-48 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateOfService}
              onChange={(e) => setDateOfService(e.target.value)}
            />
          </div>
        </div>

        {/* Card for provider details */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center justify-between">
            Provider Details
            <svg className="w-5 h-5 text-gray-300 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </h2>

          <div className="mb-4">
            <label className="block text-gray-900 font-medium mb-1 text-sm">
              Provider Name
              <span className="text-gray-500 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Healthcare provider's name"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
            />
          </div>

          {providerName && (
            <>
            {/* Provider address field removed to save space */}

            {/* Combined location type and provider specialty in one row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2 text-sm">Location Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'office', label: 'Office visit' },
                    { value: 'urgent', label: 'Urgent care' },
                    { value: 'telehealth', label: 'Telehealth' },
                    { value: 'hospital', label: 'Hospital' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`px-3 py-2 rounded-lg border text-xs font-medium focus:outline-none transition-colors
                        ${locationType === opt.value ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => setLocationType(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-2 text-sm">Provider Specialty/Type</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Primary Care, Dermatologist"
                  value={providerSpecialty}
                  onChange={(e) => setProviderSpecialty(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2 text-sm">Reason for no invoice</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Please explain why you don't have an invoice"
                value={reasonForNoInvoice}
                onChange={(e) => setReasonForNoInvoice(e.target.value)}
              />
            </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 text-base ${
            isFormValid()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
} 