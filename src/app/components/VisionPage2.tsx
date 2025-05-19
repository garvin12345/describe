'use client';

import { useState, useRef } from 'react';
import ClaimStart from './ClaimStart';
import Chat from './Chat';
import VisitNotesUpload from './VisitNotesUpload';
import ProviderPortal from './ProviderPortal';
import CalculationInProgress from './CalculationInProgress';
import { useRouter } from 'next/navigation';

interface VisionPage2Props {
  onRestart?: () => void;
  onBack?: () => void;
}

export default function VisionPage2({ onRestart, onBack }: VisionPage2Props) {
  const [showClaimStart, setShowClaimStart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVisitNotes, setShowVisitNotes] = useState(false);
  const [showProviderPortal, setShowProviderPortal] = useState(false);
  const [prelimStep, setPrelimStep] = useState(false);
  const [location, setLocation] = useState('');
  const [otherInsurance, setOtherInsurance] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [selectedToggle, setSelectedToggle] = useState<'invoice' | 'clinical'>('invoice');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const router = useRouter();

  const disqualified =
    location === 'Hospital' ||
    otherInsurance === 'Yes' ||
    downPayment === 'Yes';

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const EXAMPLE_PROVIDERS = [
    {
      id: '1',
      name: 'One Medical',
      logo: '🏥',
      description: 'Primary care provider network'
    },
    {
      id: '2',
      name: 'Kaiser Permanente',
      logo: '⚕️',
      description: 'Integrated managed care consortium'
    },
    {
      id: '3',
      name: 'Stanford Health Care',
      logo: '🏫',
      description: 'Academic medical center'
    },
    {
      id: '4',
      name: 'UCSF Medical Center',
      logo: '🔬',
      description: 'Academic medical center'
    }
  ];

  if (showClaimStart) {
    return <ClaimStart onBack={() => setShowClaimStart(false)} onRestart={onRestart} onShowOtherOptions={() => { setShowClaimStart(false); setPrelimStep(true); }} />;
  }

  if (showChat) {
    return <Chat onBack={() => setShowChat(false)} onRestart={onRestart} />;
  }

  if (showVisitNotes) {
    return <VisitNotesUpload onBack={() => setShowVisitNotes(false)} onRestart={onRestart} />;
  }

  if (showProviderPortal) {
    return <ProviderPortal onBack={() => setShowProviderPortal(false)} onRestart={onRestart} />;
  }

  if (showCalculation) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-4 bg-white">
        <div className="w-[800px] mx-auto">
          <CalculationInProgress
            expenseNumber="141192"
            userName="Garvin Chen"
            createdDate={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            invoiceData={[
              {
                dateOfService: new Date().toISOString().split('T')[0],
                drugName: 'Provider Fee for the Vision Visit',
                ndc: '99213',
                amount: '$200.00'
              }
            ]}
            pharmacyName="Vision Provider"
            onBack={() => setShowCalculation(false)}
            onRestart={onRestart}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen py-8 bg-white">
      <div className="max-w-2xl mx-auto">
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
        <div className="border rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-black">Submit a Claim</h1>
            <button
              className={`px-4 py-2 rounded-lg font-medium text-xs transition-colors ${selectedFile ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!selectedFile}
              onClick={() => selectedFile && setShowCalculation(true)}
            >
              Submit
            </button>
          </div>
          
          {!prelimStep ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    if (
                      !(
                        (e.target as HTMLElement).closest('button[data-toggle]') ||
                        (e.target as HTMLElement).closest('.drop-zone')
                      )
                    ) {
                      handleBrowseClick();
                    }
                  }}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group cursor-pointer"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleBrowseClick();
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100">
                        <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-black mb-1">Upload an Invoice or Clinical Note</h2>
                      </div>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-4 mb-3">
                      <button
                        data-toggle
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedToggle('invoice');
                        }}
                        className={`px-2 py-1 rounded-lg text-xs ${
                          selectedToggle === 'invoice'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Invoice
                      </button>
                      <button
                        data-toggle
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedToggle('clinical');
                        }}
                        className={`px-2 py-1 rounded-lg text-xs ${
                          selectedToggle === 'clinical'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Clinical Notes
                      </button>
                    </div>
                    
                    {selectedToggle === 'invoice' ? (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-medium mb-2 text-xs">Required Information:</h3>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Patient Name
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Date of Service
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Provider Name
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            CPT codes
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Amount charged for each service
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-medium mb-2 text-xs">Required Information:</h3>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Patient Name
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Date of Service
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Provider Name
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Provider's description of services
                          </li>
                        </ul>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 drop-zone">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {selectedFile ? (
                          <div className="mb-2">
                            <p className="text-black mb-1 text-xs">Selected file: {selectedFile.name}</p>
                          </div>
                        ) : (
                          <div className="mb-2 text-black text-xs">
                            Drag file here or <button onClick={handleBrowseClick} className="text-teal-500 hover:text-teal-600 underline">browse file</button>
                          </div>
                        )}
                        <div className="text-xs text-black">
                          File type: jpg, gif, png or pdf (30MB max)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group cursor-pointer"
                  onClick={() => setShowProviderSearch(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setShowProviderSearch(true);
                    }
                  }}
                >
                  {!showProviderSearch ? (
                    <div className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100">
                          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div className="flex flex-col justify-center items-start">
                          <h2 className="text-base font-semibold text-black mb-1 text-left">Connect Provider Portal</h2>
                          <p className="text-xs text-gray-600 text-left">Connect to your provider's portal for visit notes</p>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setShowProviderSearch(false)}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-xs"
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <div className="mb-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={providerSearchQuery}
                            onChange={(e) => setProviderSearchQuery(e.target.value)}
                            placeholder="Search for your healthcare provider..."
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg pl-8 focus:outline-none focus:border-teal-500 text-xs"
                          />
                          <svg
                            className="absolute left-2 top-2.5 w-4 h-4 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-sm font-semibold text-black mb-2">Popular Providers</h2>
                        {EXAMPLE_PROVIDERS.filter(provider =>
                          provider.name.toLowerCase().includes(providerSearchQuery.toLowerCase())
                        ).map((provider) => (
                          <button
                            key={provider.id}
                            className="w-full bg-white border-2 border-gray-100 rounded-lg p-4 text-left hover:border-teal-500 transition-colors group flex items-center gap-4"
                            onClick={() => router.push(`/provider-login/${provider.id}`)}
                          >
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-lg">
                              {provider.logo}
                            </div>
                            <div>
                              <h3 className="text-xs font-semibold text-black mb-0.5">{provider.name}</h3>
                              <p className="text-xs text-gray-600">{provider.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setPrelimStep(true)}
                className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-teal-500 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                      <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Can't do either? Check your eligibility to describe what happened</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="mb-6 text-xs text-gray-700">
                If you don't have an invoice, you might still be eligible to submit your expense using alternative methods. Please answer the questions below to determine your eligibility.
              </div>
              <div>
                <label className="block font-medium mb-2 text-sm">Where did your visit with the provider take place?</label>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Provider's Office",
                      "Telehealth",
                      "Clinic",
                      "Urgent Care",
                      "Hospital"
                    ].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="location"
                          value={opt}
                          checked={location === opt}
                          onChange={() => setLocation(opt)}
                          className="form-radio text-teal-500"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2 text-sm">Do you have any other vision insurance coverage?</label>
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "No, this is my only coverage",
                      "Yes"
                    ].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="otherInsurance"
                          value={opt}
                          checked={otherInsurance === opt}
                          onChange={() => setOtherInsurance(opt)}
                          className="form-radio text-teal-500"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2 text-sm">Is this a down payment for the service?</label>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "No",
                      "Yes"
                    ].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="downPayment"
                          value={opt}
                          checked={downPayment === opt}
                          onChange={() => setDownPayment(opt)}
                          className="form-radio text-teal-500"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {disqualified ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded text-xs">
                  <p className="font-semibold mb-2">You must upload an invoice.</p>
                  <p>Other options to submit an invoice aren't available because we don't support the option(s) you selected.</p>
                  <button
                    onClick={() => setShowClaimStart(true)}
                    className="mt-4 w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100">
                          <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-black mb-1">Upload an Invoice or Clinical Note</h2>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              ) : (location && otherInsurance && downPayment) ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowChat(true)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100">
                          <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-black mb-1">Describe Your Visit</h2>
                          <p className="text-xs text-gray-600">Tell us about your vision visit</p>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="mt-8">
                  <button
                    onClick={() => setPrelimStep(false)}
                    className="flex items-center text-gray-600 hover:text-gray-900 text-xs"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to options
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 