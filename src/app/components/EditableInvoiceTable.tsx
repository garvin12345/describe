import React, { useState } from 'react';

interface InvoiceItem {
  dateOfService: string;
  drugName: string;
  ndc: string;
  amount: string;
}

interface EditableInvoiceTableProps {
  initialData: InvoiceItem[];
  onSave: (data: InvoiceItem[], providerName: string) => void;
  onCancel: () => void;
}

export default function EditableInvoiceTable({ initialData, onSave, onCancel }: EditableInvoiceTableProps) {
  const [items, setItems] = useState<InvoiceItem[]>(initialData);
  const [providerName, setProviderName] = useState('Dr. Leean');

  const handleInputChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace('$', ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th colSpan={4} className="px-6 py-4 text-left text-lg font-medium text-gray-900 bg-white">
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full text-lg font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none"
                placeholder="Provider Name"
              />
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
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <input
                  type="date"
                  value={item.dateOfService}
                  onChange={(e) => handleInputChange(index, 'dateOfService', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(index, 'drugName', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., Office Visit"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={item.ndc}
                  onChange={(e) => handleInputChange(index, 'ndc', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., 99213"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border-b border-gray-300 focus:border-teal-500 focus:outline-none text-right"
                  placeholder="$0.00"
                />
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-medium">
            <td className="px-6 py-4 text-sm text-gray-900">Total</td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4 text-sm text-gray-900 text-right">${calculateTotal().toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(items, providerName)}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 