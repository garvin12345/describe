import React, { useState } from 'react';
import EditableInvoiceTable from './EditableInvoiceTable';

interface InvoiceConfirmationProps {
  onConfirm: () => void;
  onEdit: () => void;
}

const initialData = [
  {
    dateOfService: '2024-03-15',
    drugName: 'Office Visit',
    ndc: '99213',
    amount: '$150.00'
  }
];

export default function InvoiceConfirmation({ onConfirm, onEdit }: InvoiceConfirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(initialData);
  const [providerName, setProviderName] = useState('Dr. Leean');

  const handleSave = (newData: typeof initialData, newProviderName: string) => {
    setInvoiceData(newData);
    setProviderName(newProviderName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Edit Visit Information
        </h2>

        <EditableInvoiceTable
          initialData={invoiceData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
      <h2 className="text-xl font-semibold mb-6 text-black">
        We've found your previous visit information:
      </h2>

      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th colSpan={4} className="px-6 py-4 text-left text-lg font-medium text-gray-900 bg-white">
                {providerName}
              </th>
            </tr>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date of Service</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">CPT Code</th>
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
          onClick={() => setIsEditing(true)}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          No, I'd like to make changes
        </button>
      </div>
    </div>
  );
} 