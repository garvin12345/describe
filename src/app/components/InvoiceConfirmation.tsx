import React, { useState } from 'react';
import EditableInvoiceTable from './EditableInvoiceTable';

interface InvoiceConfirmationProps {
  onConfirm: () => void;
  onEdit: () => void;
  onBack?: () => void;
  isPharmacy?: boolean;
  onUpload?: () => void;
}

const initialData = [
  {
    dateOfService: '2024-03-15',
    drugName: 'Provider Fee for the Therapy Session',
    ndc: '99213',
    amount: '$150.00'
  }
];

export default function InvoiceConfirmation({ onConfirm, onEdit, onBack, isPharmacy = false, onUpload }: InvoiceConfirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceData, setInvoiceData] = useState([
    {
      dateOfService: new Date().toISOString().split('T')[0],
      drugName: isPharmacy ? 'Lipitor 10mg tablets' : 'Provider Fee for the Therapy Session',
      ndc: isPharmacy ? '0071-0155-23' : '99213',
      amount: '$350.00'
    }
  ]);
  const [providerName, setProviderName] = useState(isPharmacy ? 'CVS Pharmacy' : 'Dr. Leean');

  const handleSave = (newData: typeof initialData, newProviderName: string) => {
    setInvoiceData(newData);
    setProviderName(newProviderName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <h2 className="text-xl font-semibold mb-6 text-black">
          Edit Visit Information
        </h2>

        <EditableInvoiceTable
          initialData={invoiceData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isPharmacy={isPharmacy}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-black">
        Confirm Information
      </h2>

      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            {/* Show CVS Pharmacy as header for pharmacy, Provider Info for non-pharmacy */}
            {isPharmacy ? (
              <tr>
                <th colSpan={4} className="px-6 py-4 text-left bg-white">
                  <div className="text-lg font-medium text-gray-900 mb-2">CVS Pharmacy</div>
                </th>
              </tr>
            ) : (
              <tr className="border-b border-gray-200">
                <th colSpan={4} className="px-6 py-4 text-left bg-white">
                  <div className="text-lg font-medium text-gray-900 mb-2">Provider Info</div>
                  <div className="text-sm text-gray-600">
                    <div>{providerName}</div>
                    <div>NPI 123456789</div>
                    <div>Mental Health</div>
                  </div>
                </th>
              </tr>
            )}
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date of Service</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">{isPharmacy ? 'Drug Name' : 'Service'}</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">{isPharmacy ? 'NDC' : 'CPT Code'}</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoiceData.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900">{item.dateOfService}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.drugName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.ndc}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.amount}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-4 text-sm text-gray-900">Total</td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">
                ${invoiceData.reduce((sum, item) => sum + parseFloat(item.amount.replace('$', '')), 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8 text-center text-gray-700">
        <p>
          I confirm that the information I've provided is true and accurate, to the best of my
          knowledge. I understand that submitting false or deceptive information may be considered insurance fraud.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
        >
          Yes, this is correct. Please Submit
        </button>
        <button
          onClick={isPharmacy ? () => setIsEditing(true) : onUpload}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          {isPharmacy ? "I'd like to make changes" : "Different treatment, I'd like to upload instead"}
        </button>
      </div>
    </div>
  );
} 