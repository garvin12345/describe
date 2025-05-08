'use client';

import { useRef, useEffect, useState } from 'react';

interface CPTEntry {
  code: string;
  description: string;
}

interface InvoiceProps {
  cptEntries: CPTEntry[];
  memberDescription: string;
  onReset?: () => void;
  onRestart?: () => void;
}

export default function Invoice({ cptEntries, memberDescription, onReset, onRestart }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isAttested, setIsAttested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Handle reset button click
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Handle return to dashboard click
  const handleReturnToDashboard = () => {
    if (onRestart) {
      onRestart();
    }
  };

  const handleDownload = async () => {
    if (!isAttested) {
      alert('Please check the attestation box before downloading the invoice.');
      return;
    }

    if (!invoiceRef.current) {
      console.error('Invoice ref is null');
      return;
    }

    setIsLoading(true);

    try {
      // Dynamically import html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const invoiceClone = invoiceRef.current.cloneNode(true) as HTMLElement;
      
      // Remove the download section from the clone
      const downloadSection = invoiceClone.querySelector('[data-download-section]');
      if (downloadSection?.parentNode) {
        downloadSection.parentNode.removeChild(downloadSection);
      }

      // Remove the header section (with Reset and Return to Dashboard) from the clone
      const headerSection = invoiceClone.querySelector('.flex.justify-between.items-center.mb-6');
      if (headerSection?.parentNode) {
        headerSection.parentNode.removeChild(headerSection);
      }

      // Remove the Invoice Preview section (heading and paragraph)
      const previewHeading = invoiceClone.querySelector('h2.text-2xl.font-bold.mb-2');
      if (previewHeading?.parentNode) {
        // Remove the heading
        const parent = previewHeading.parentNode;
        parent.removeChild(previewHeading);
        // Remove the next sibling paragraph if it exists
        const next = parent.querySelector('p.text-gray-600');
        if (next) {
          parent.removeChild(next);
        }
      }

      // Remove extra top padding/margin from the main container
      invoiceClone.style.paddingTop = '0px';
      invoiceClone.style.marginTop = '0px';
      // Remove extra top padding/margin from the first child (main content)
      const firstChild = invoiceClone.firstElementChild as HTMLElement | null;
      if (firstChild) {
        firstChild.style.marginTop = '0px';
        firstChild.style.paddingTop = '0px';
      }

      // Remove any element containing 'Generating PDF...' text
      invoiceClone.querySelectorAll('button').forEach(el => {
        if (el.textContent && el.textContent.trim() === 'Generating PDF...') {
          el.parentNode?.removeChild(el);
        }
      });

      // Set explicit colors for PDF generation
      const pdfStyles = document.createElement('style');
      pdfStyles.textContent = `
        * {
          color: rgb(0, 0, 0) !important;
          background-color: rgb(255, 255, 255) !important;
        }
        .text-gray-600 {
          color: rgb(75, 85, 99) !important;
        }
        .text-teal-600 {
          color: rgb(13, 148, 136) !important;
        }
        .bg-blue-100 {
          background-color: rgb(219, 234, 254) !important;
        }
        .text-blue-800 {
          color: rgb(30, 64, 175) !important;
        }
        .text-red-500 {
          color: rgb(239, 68, 68) !important;
        }
      `;
      invoiceClone.appendChild(pdfStyles);

      const opt = {
        margin: 1,
        filename: 'sidecar-health-invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait'
        }
      };

      await html2pdf().from(invoiceClone).set(opt).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={invoiceRef} className="container mx-auto px-4 py-4 max-w-3xl">
      {/* Progress Indicator - balanced size */}
      <div className="flex items-center justify-center mb-5 pt-2">
        {/* Step 1: Describe Visit */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white bg-teal-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="mt-1 text-xs font-medium text-teal-700">Describe Visit</span>
        </div>
        <div className="flex-1 h-0.5 bg-teal-500 mx-2" />
        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white bg-teal-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="mt-1 text-xs font-medium text-teal-700">Add Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-teal-500 mx-2" />
        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white bg-teal-500 border-2 border-teal-500">3</div>
          <span className="mt-1 text-xs font-medium text-teal-700">Review & Submit</span>
        </div>
      </div>
      
      {/* Navigation buttons - more balanced size */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleReset}
          className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        <button
          onClick={handleReturnToDashboard}
          className="flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return to Dashboard
        </button>
      </div>
      
      <div className="rounded-lg shadow-lg p-5 max-w-3xl mx-auto bg-white">
        {/* Header with logo and disclaimer */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-7 h-7 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#1a237e"/>
                <path d="M6 12h12M12 6v12" stroke="white" strokeWidth="2"/>
              </svg>
              <span className="text-base text-black">sidecar health</span>
            </div>
            <p className="text-xs text-gray-600">
              Member provided information
            </p>
          </div>
        </div>

        {/* Patient info */}
        <div className="mb-4">
          <div className="text-sm text-black">
            <p className="inline-block mr-4">Patient: Garvin Chen</p>
            <p className="inline-block">DOB: 05/29/1980</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th className="text-left py-2 px-3 text-black">Date</th>
                  <th className="text-left py-2 px-3 text-black">CPT Code</th>
                  <th className="text-left py-2 px-3 text-black">Description</th>
                  <th className="text-right py-2 px-3 text-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {cptEntries.map((entry, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="py-2 px-3 text-black">{formattedDate}</td>
                    <td className="py-2 px-3 text-black">{entry.code}</td>
                    <td className="py-2 px-3 text-black">{entry.description}</td>
                    <td className="text-right py-2 px-3 text-black">--</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-2">
            <p className="font-semibold text-black text-sm">Swipe Amount: $250</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-black">Member-provided Description:</h3>
          <p className="text-sm text-gray-600">{memberDescription}</p>
        </div>

        <div className="mb-5 flex items-start gap-3" data-download-section>
          <input
            type="checkbox"
            id="attestation"
            checked={isAttested}
            onChange={(e) => setIsAttested(e.target.checked)}
            className="mt-1"
            style={{ accentColor: '#000000' }}
          />
          <label htmlFor="attestation" className="text-sm text-gray-600">
            <p className="mb-2">
              I confirm that the information I've provided is true and accurate. I understand that submitting false information may be considered insurance fraud.
            </p>
            <p>
              I also understand that by completing this form instead of submitting an itemized invoice, I waive any earned benefit credit.
            </p>
          </label>
        </div>

        <div className="relative" data-download-section>
          <button 
            onClick={handleDownload}
            className="px-5 py-2 rounded-lg flex items-center gap-2 w-full justify-center text-sm"
            style={{ 
              backgroundColor: isAttested ? '#000000' : '#999999', 
              color: '#FFFFFF',
              cursor: isAttested ? 'pointer' : 'not-allowed'
            }}
            disabled={!isAttested || isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
            </svg>
            {isLoading ? 'Generating PDF...' : 'Download Invoice'}
          </button>
          {!isAttested && (
            <div className="absolute -top-6 left-0 right-0 text-center text-xs text-red-500">
              Please check the attestation box above to enable download
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 