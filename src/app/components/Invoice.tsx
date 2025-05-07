'use client';

import { useRef, useEffect, useState } from 'react';

interface InvoiceProps {
  cptCode: string;
  cptDescription: string;
  memberDescription: string;
}

const CPT_DESCRIPTIONS: Record<string, string> = {
  '99201': 'New patient office visit - Problem focused (10 min)',
  '99202': 'New patient office visit - Expanded problem focused (20 min)',
  '99203': 'New patient office visit - Detailed (30 min)',
  '99204': 'New patient office visit - Comprehensive, moderate complexity (45 min)',
  '99205': 'New patient office visit - Comprehensive, high complexity (60 min)',
  '99211': 'Established patient office visit - Minimal (5 min)',
  '99212': 'Established patient office visit - Problem focused (10 min)',
  '99213': 'Established patient office visit - Expanded problem focused (15 min)',
  '99214': 'Established patient office visit - Detailed, moderate complexity (25 min)',
  '99215': 'Established patient office visit - Comprehensive, high complexity (40 min)',
  '87880': 'Strep A by immunoassay',
};

export default function Invoice({ cptCode, cptDescription, memberDescription }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isAttested, setIsAttested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  useEffect(() => {
    // Pre-load html2pdf.js
    import('html2pdf.js');
  }, []);

  const handleDownload = async () => {
    if (!isAttested) {
      alert('Please check the attestation box before downloading the invoice.');
      return;
    }

    console.log('Download button clicked');
    if (!invoiceRef.current) {
      console.error('Invoice ref is null');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Importing html2pdf.js...');
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      console.log('html2pdf.js imported successfully');

      // Create a clone of the invoice element without the download button
      const invoiceClone = invoiceRef.current.cloneNode(true) as HTMLElement;
      const downloadButton = invoiceClone.querySelector('#downloadButton');
      if (downloadButton?.parentNode) {
        downloadButton.parentNode.removeChild(downloadButton);
      }

      const opt = {
        margin: 0.5,
        filename: 'sidecar-health-invoice.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait'
        }
      };

      console.log('Starting PDF generation...');
      const worker = html2pdf()
        .from(invoiceClone)
        .set(opt);

      console.log('Saving PDF...');
      await worker.save();
      console.log('PDF generated successfully');

    } catch (error) {
      console.error('Error in PDF generation:', error);
      alert('Failed to generate PDF. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={invoiceRef} className="rounded-lg shadow-lg p-6 max-w-3xl mx-auto" style={{ color: '#000000', backgroundColor: '#FFFFFF' }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>Invoice Preview</h2>
        <p style={{ color: '#4B5563' }}>Review your generated invoice based on the information provided.</p>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#1a237e"/>
            <path d="M6 12h12M12 6v12" stroke="white" strokeWidth="2"/>
          </svg>
          <span className="text-xl" style={{ color: '#000000' }}>sidecar health</span>
        </div>
      </div>

      <p className="text-center mb-6" style={{ color: '#4B5563' }}>
        This invoice was generated from member provided information.
      </p>

      <div className="mb-8" style={{ color: '#000000' }}>
        <p>Patient Name: Garvin Chen</p>
        <p>DOB: 05/29/1980</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#000000' }}>Services</h3>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ color: '#000000' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th className="text-left py-2 px-4" style={{ color: '#000000' }}>Date</th>
                <th className="text-left py-2 px-4" style={{ color: '#000000' }}>CPT Code</th>
                <th className="text-left py-2 px-4" style={{ color: '#000000' }}>Description</th>
                <th className="text-right py-2 px-4" style={{ color: '#000000' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td className="py-2 px-4">{formattedDate}</td>
                <td className="py-2 px-4">{cptCode}</td>
                <td className="py-2 px-4">{CPT_DESCRIPTIONS[cptCode] || cptDescription}</td>
                <td className="text-right py-2 px-4">--</td>
              </tr>
              {cptCode === '99213' && (
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td className="py-2 px-4">{formattedDate}</td>
                  <td className="py-2 px-4">87880</td>
                  <td className="py-2 px-4">{CPT_DESCRIPTIONS['87880']}</td>
                  <td className="text-right py-2 px-4">--</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-right mt-4">
          <p className="font-semibold" style={{ color: '#000000' }}>Swipe Amount: $250</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>Member-provided Description:</h3>
        <p style={{ color: '#4B5563' }}>{memberDescription}</p>
      </div>

      <div className="mb-8 flex items-start gap-2">
        <input
          type="checkbox"
          id="attestation"
          checked={isAttested}
          onChange={(e) => setIsAttested(e.target.checked)}
          className="mt-1"
          style={{ accentColor: '#000000' }}
        />
        <label htmlFor="attestation" style={{ color: '#4B5563' }}>
          <p className="mb-4">
            I confirm that the information I've provided is true and accurate, to the best of my
            knowledge. I understand that submitting false or deceptive information may be considered insurance fraud.
          </p>
          <p>
            I also understand that by completing this form instead of submitting an itemized invoice from my provider, I
            waive any earned benefit credit I would otherwise receive related to this expense should the calculated
            benefit amount exceed the provider charge.
          </p>
        </label>
      </div>

      <div className="relative">
        <button 
          id="downloadButton"
          onClick={handleDownload}
          className="px-6 py-2 rounded-lg flex items-center gap-2 w-full justify-center"
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
          Download Invoice {isLoading && '(Generating...)'}
        </button>
        {!isAttested && (
          <div className="absolute -top-8 left-0 right-0 text-center text-sm" style={{ color: '#EF4444' }}>
            Please check the attestation box above to enable download
          </div>
        )}
      </div>
    </div>
  );
} 