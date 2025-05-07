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
    isFirstVisit: boolean | null;
    visitDuration: string;
  }) => void;
}

export default function MedicalVisitForm({ onSubmit }: MedicalVisitFormProps) {
  const [description, setDescription] = useState('');
  const [patientName, setPatientName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [locationType, setLocationType] = useState('');
  const [reasonForNoInvoice, setReasonForNoInvoice] = useState('');
  const [providerSpecialty, setProviderSpecialty] = useState('');
  const [dateOfService, setDateOfService] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [visitDuration, setVisitDuration] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

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
      isFirstVisit,
      visitDuration
    });
  };

  const isFormValid = () => {
    return description.length >= 20;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2">Describe your visit</h1>
      <p className="text-gray-600 mb-4"></p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">
            <span className="text-gray-900 font-medium">Please describe your visit and all services that were performed</span>
            <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full h-28 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe what happened during your visit, including any tests, procedures, or treatments..."
            value={description}
            onChange={handleDescriptionChange}
          />
          <div className="flex justify-between text-sm mt-1">
            {characterCount < 20 ? (
              <span className="text-orange-500">At least {20 - characterCount} more characters required</span>
            ) : (
              <span className="text-gray-500">✓ Minimum length met</span>
            )}
            <span className="text-gray-500">{characterCount} / 20+ characters</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Patient Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Provider Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Healthcare provider's name"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Provider Address</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full address of the healthcare provider"
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Location Type</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="">Select location type</option>
              <option value="office">Office visit</option>
              <option value="urgent">Urgent care</option>
              <option value="telehealth">Telehealth</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Provider Specialty/Type</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Primary Care, Dermatologist"
              value={providerSpecialty}
              onChange={(e) => setProviderSpecialty(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-900 font-medium mb-1">Reason for no invoice</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please explain why you don't have an invoice"
            value={reasonForNoInvoice}
            onChange={(e) => setReasonForNoInvoice(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-900 font-medium mb-2">Was this your first time seeing this provider?</p>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600"
                  checked={isFirstVisit === true}
                  onChange={() => setIsFirstVisit(true)}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600"
                  checked={isFirstVisit === false}
                  onChange={() => setIsFirstVisit(false)}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">How long was your visit?</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={visitDuration}
              onChange={(e) => setVisitDuration(e.target.value)}
            >
              <option value="">Select duration</option>
              <option value="5-10">5-10 minutes</option>
              <option value="10-19">10-19 minutes</option>
              <option value="20-29">20-29 minutes</option>
              <option value="30-39">30-39 minutes</option>
              <option value="40+">40+ minutes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Date of Service</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateOfService}
              onChange={(e) => setDateOfService(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Charge Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
            isFormValid()
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Invoice
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
} 