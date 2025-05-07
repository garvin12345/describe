import React from 'react';

interface InvoiceItem {
  dateOfService: string;
  drugName: string;
  ndc: string;
  amount: string;
}

interface CalculationInProgressProps {
  expenseNumber: string;
  userName: string;
  createdDate: string;
  invoiceData?: InvoiceItem[];
  pharmacyName?: string;
  onBack?: () => void;
  onRestart?: () => void;
}

export default function CalculationInProgress({ 
  expenseNumber = '141192',
  userName = 'Sirius Black',
  createdDate = 'Mar 5, 2025',
  invoiceData = [
    {
      dateOfService: '2024-01-15',
      drugName: 'Metformin HCL 1000MG',
      ndc: '00000-123-45',
      amount: '$20.00'
    },
    {
      dateOfService: '2024-01-15',
      drugName: 'Mupirocin 2% Ointment',
      ndc: '68462-180-22',
      amount: '$15.00'
    }
  ],
  pharmacyName = 'CVS Pharmacy',
  onBack,
  onRestart
}: CalculationInProgressProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="w-[800px]">
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
              </div>
              <div>
                {onRestart && (
                  <button
                    onClick={onRestart}
                    className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return to Dashboard
                  </button>
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              Expense #{expenseNumber}
            </h1>

            <div className="text-gray-600 mb-12">
              {userName} | Created {createdDate} | Expense #{expenseNumber}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center mb-12">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="ml-2 text-gray-500">Submit invoices</span>
              </div>
              <div className="h-1 w-12 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  2
                </div>
                <span className="ml-2 text-gray-900 font-medium">Calculate benefits</span>
              </div>
              <div className="h-1 w-12 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  3
                </div>
                <span className="ml-2 text-gray-500">Receive benefits</span>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th colSpan={4} className="px-6 py-4 text-left text-lg font-medium text-gray-900 bg-white">
                      {pharmacyName}
                    </th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date of Service</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Drug Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">NDC</th>
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

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Calculation in process
            </h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-blue-900">
                We will notify you when we've finished reviewing your itemized invoices and calculating your 
                Benefit Amount. If you have questions or want to amend the invoices submitted, please call{' '}
                <a href="tel:855-282-0822" className="text-teal-600 hover:text-teal-700">
                  855-282-0822
                </a>.
              </p>
            </div>

            {/* Related Documents Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Related claim documents
              </h3>
              <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">CVS Pharmacy Invoice</div>
                    <div className="text-sm text-gray-500">Uploaded {createdDate}</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Activity
              </h3>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">Proof(s) of care submitted</div>
                    <div className="text-sm text-gray-500">{createdDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-[360px]">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <button className="w-full bg-teal-500 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Upload more docs
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Have questions?
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  New message
                </div>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  Chat now
                </div>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="w-full text-left text-teal-600 hover:text-teal-700 flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Call 855-282-0822
                </div>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 