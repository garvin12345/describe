'use client';

import { useState, useRef, useEffect } from 'react';
import Invoice from './Invoice';
import MedicalVisitForm from './MedicalVisitForm';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface CPTEntry {
  code: string;
  description: string;
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
  const [confirmedCPTEntries, setConfirmedCPTEntries] = useState<CPTEntry[]>([]);
  const [memberDescription, setMemberDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add effect to scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Force scroll to bottom after DOM updates
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  // Add effect to monitor state changes
  useEffect(() => {
    if (showInvoice && confirmedCPTEntries.length > 0) {
      console.log('State updated - should show invoice:', {
        showInvoice,
        confirmedCPTEntries,
        memberDescription
      });
    }
  }, [showInvoice, confirmedCPTEntries, memberDescription]);

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

    const initialMessage = messageParts.join('. ') + '.';
    sendMessage(initialMessage);
  };

  const handleConfirmation = (userResponse: string) => {
    if (userResponse.toLowerCase().includes('yes')) {
      // Get all messages from the model that contain CPT codes
      const cptMessages = messages.filter(msg => 
        msg.role === 'model' && msg.content.includes('CPT code')
      );

      if (cptMessages.length > 0) {
        // Collect all CPT codes from all relevant messages
        const allEntries: CPTEntry[] = [];
        
        cptMessages.forEach(message => {
          const cptMatches = [...message.content.matchAll(/CPT code (\d{5})(?:\s*[-:(\s]\s*)(.*?)(?=(?:\.|$|\n|CPT code|\sand\s|,))/g)];
          
          cptMatches.forEach(match => {
            const code = match[1];
            const description = match[2].replace(/[()]/g, '').trim();
            
            // Only add if this code hasn't been added yet
            if (!allEntries.some(entry => entry.code === code)) {
              allEntries.push({ code, description });
            }
          });
        });

        if (allEntries.length > 0) {
          // Update both states together
          setConfirmedCPTEntries(allEntries);
          setShowInvoice(true);
          return true;
        }
      }
    }
    return false;
  };

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check for confirmation first
      if (content.toLowerCase().includes('yes')) {
        const wasConfirmed = handleConfirmation(content);
        if (wasConfirmed) {
          setIsLoading(false);
          return;
        }
      }

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

      // Add the AI's response to messages
      setMessages(prev => [...prev, { role: 'model', content: data.message }]);

      // Only route to invoice if the AI's message contains the creation phrase
      if (data.message.toLowerCase().includes('creating invoice with cpt code')) {
        // Find the part after "Creating invoice with CPT code(s):"
        const cptSection = data.message.split(/creating invoice with cpt code\(s\):/i)[1];
        if (cptSection) {
          // Match all lines of the form [CODE] - [DESCRIPTION]
          const matches = [...cptSection.matchAll(/(\d{5})\s*-\s*(.+)/g)];
          if (matches.length > 0) {
            const allEntries = matches.map(match => ({
              code: match[1],
              description: match[2].trim()
            }));
            setConfirmedCPTEntries(allEntries);
            setShowInvoice(true);
            return;
          }
        }
      }

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

  // Handle reset - returns to medical visit form
  const handleReset = () => {
    setShowInvoice(false);
    setShowForm(true);
    setMessages([]);
    setConfirmedCPTEntries([]);
    setMemberDescription('');
  };

  // Handle restart - returns to expense dashboard
  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    }
  };

  if (showInvoice && confirmedCPTEntries.length > 0) {
    return (
      <div className="bg-white">
        <Invoice 
          cptEntries={confirmedCPTEntries}
          memberDescription={memberDescription}
          onReset={handleReset}
          onRestart={handleRestart}
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
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2 ml-4 mt-0"
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
    <div className="max-w-3xl mx-auto p-2 pt-0">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-4 pt-6">
        {/* Step 1: Describe Visit (completed, check mark) */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-teal-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="mt-2 text-sm font-medium text-teal-700">Describe Visit</span>
        </div>
        <div className="flex-1 h-0.5 bg-teal-500 mx-2" />
        {/* Step 2: Add Details (active, same color as step 1) */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-teal-500">2</div>
          <span className="mt-2 text-sm font-medium text-teal-700">Add Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        {/* Step 3: Review & Submit (upcoming) */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-400 border-2 border-gray-300 bg-white">3</div>
          <span className="mt-2 text-sm font-medium text-gray-400">Review & Submit</span>
        </div>
      </div>
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
          <div className="mb-4 space-y-6 h-[500px] overflow-y-auto p-4" style={{ scrollBehavior: 'smooth' }}>
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
                  {message.content.replace(/=+/g, '').trim()}
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
    </div>
  );
} 