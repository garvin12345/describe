'use client';

import { useState, useRef, useEffect } from 'react';
import Invoice from './Invoice';
import MedicalVisitForm from './MedicalVisitForm';

interface Message {
  role: 'user' | 'model';
  content: string;
}

// New function to format the message text
const formatMessage = (text: string) => {
  return text
    .split('*') // Split by asterisk
    .map((segment, index) => (
      <span key={index}>
        {segment}
        {index !== text.split('*').length - 1 && <br />} {/* Add line break after each segment except the last */}
      </span>
    ));
};

interface ChatProps {
  onBack?: () => void;
  onRestart?: () => void;
}

export default function Chat({ onBack, onRestart }: ChatProps) {
  const [showForm, setShowForm] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [confirmedCPTCode, setConfirmedCPTCode] = useState('');
  const [memberDescription, setMemberDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFormSubmit = (formData: {
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
  }) => {
    setShowForm(false);
    setMemberDescription(formData.description);

    // Build the initial message with only the relevant fields for CPT determination
    let messageParts = [];
    messageParts.push(formData.description);

    if (formData.dateOfBirth) {
      messageParts.push(`My date of birth is ${formData.dateOfBirth}`);
    }

    if (formData.providerSpecialty) {
      messageParts.push(`I saw a ${formData.providerSpecialty} provider`);
    }

    if (formData.isFirstVisit !== null) {
      messageParts.push(formData.isFirstVisit ? 'This was my first visit with this provider' : 'This was a follow-up visit');
    }

    if (formData.visitDuration) {
      messageParts.push(`The visit lasted ${formData.visitDuration} minutes`);
    }

    const initialMessage = messageParts.join('. ') + '.';
    sendMessage(initialMessage);
  };

  const handleConfirmation = (userResponse: string) => {
    if (userResponse.toLowerCase().includes('yes')) {
      const cptMessage = [...messages].reverse().find(msg => 
        msg.role === 'model' && msg.content.includes('CPT code')
      );

      if (cptMessage) {
        const cptMatch = cptMessage.content.match(/(?:CPT code )?(\d{5})/);
        
        if (cptMatch) {
          const cptCode = cptMatch[1];
          setConfirmedCPTCode(cptCode);
          setShowInvoice(true);
        }
      }
    }
  };

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, newMessage]);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { role: 'model', content: data.message }]);
      handleConfirmation(content);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const message = userInput.trim();
    setUserInput('');
    await sendMessage(message);
  };

  if (showInvoice) {
    return (
      <div className="bg-white">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 ml-4 mt-4"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <Invoice 
          cptCode={confirmedCPTCode}
          cptDescription={confirmedCPTCode === '99213' ? 'Provider Fee for the Therapy Session' : 'Provider Fee for the Therapy Session'}
          memberDescription={memberDescription}
          onReset={onBack}
          onRestart={onRestart}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 ml-4 mt-4"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <MedicalVisitForm onSubmit={handleFormSubmit} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 space-y-6 min-h-[600px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-6 whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-6 text-gray-800">
                Typing...
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center p-4">{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 