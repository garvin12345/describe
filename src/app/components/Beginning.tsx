'use client';

import { useState } from 'react';
import ClaimStart from './ClaimStart';
import Chat from './Chat';
import VisitNotesUpload from './VisitNotesUpload';
import ProviderPortal from './ProviderPortal';

interface BeginningProps {
  onRestart?: () => void;
  onBack?: () => void;
}

export default function Beginning({ onRestart, onBack }: BeginningProps) {
  const [showClaimStart, setShowClaimStart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showVisitNotes, setShowVisitNotes] = useState(false);
  const [showProviderPortal, setShowProviderPortal] = useState(false);
  const [prelimStep, setPrelimStep] = useState(false);
  const [location, setLocation] = useState('');
  const [otherInsurance, setOtherInsurance] = useState('');
  const [downPayment, setDownPayment] = useState('');

  const disqualified =
    location === 'Hospital' ||
    otherInsurance === 'Yes' ||
    downPayment === 'Yes';

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
          <h1 className="text-3xl font-bold text-black mb-8">Submit a Claim</h1>
          
          {!prelimStep ? (
            <div className="space-y-6">
              <button
                onClick={() => setShowClaimStart(true)}
                className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100">
                      <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-black mb-1">Upload an Invoice</h2>
                      <p className="text-gray-600">Submit a claim with your medical invoice</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => setPrelimStep(true)}
                className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-black mb-1">Other Options</h2>
                      <p className="text-gray-600">Submit a claim without an invoice</p>
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
              <div className="mb-6 text-gray-700">
                If you don't have an invoice, you might still be eligible to submit your expense using alternative methods. Please answer the questions below to determine your eligibility.
              </div>
              <div>
                <label className="block font-medium mb-2">Where did your visit with the provider take place?</label>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Doctor's office",
                      "Telehealth (video or phone)",
                      "Clinic",
                      "Urgent care",
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
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Do you have any other health insurance coverage?</label>
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
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Is this a down payment for the service?</label>
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
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {disqualified ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
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
                          <h2 className="text-xl font-semibold text-black mb-1">Upload an Invoice</h2>
                          <p className="text-gray-600">Submit a claim with your medical invoice</p>
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
                    onClick={() => setShowVisitNotes(true)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
                          <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-black mb-1">Upload Visit Notes</h2>
                          <p className="text-gray-600">Submit your medical visit notes</p>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowProviderPortal(true)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-teal-500 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100">
                          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-black mb-1">Connect Provider Portal</h2>
                          <p className="text-gray-600">Connect to your provider's portal for visit notes</p>
                        </div>
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
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
                          <h2 className="text-xl font-semibold text-black mb-1">Describe Your Visit</h2>
                          <p className="text-gray-600">Tell us about your medical visit</p>
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
                    className="flex items-center text-gray-600 hover:text-gray-900"
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