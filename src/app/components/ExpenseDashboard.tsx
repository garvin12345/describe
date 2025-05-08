'use client';

import { useState } from 'react';
import Recurring from './Recurring';
import Beginning from './Beginning';
import ClaimStart from './ClaimStart';
import Invoice from './Invoice';

interface Expense {
  id: string;
  expenseNumber: string;
  title: string;
  date: string;
  status: 'NEW';
  totalBill: string;
  planPays: string;
  yourPortion: string;
  youOwe: string;
}

const EXPENSES: Expense[] = [
  {
    id: '1',
    expenseNumber: '554936',
    title: 'Swipe - Recurring Expense',
    date: 'May 1, 2025',
    status: 'NEW',
    totalBill: 'Pending',
    planPays: 'Pending',
    yourPortion: 'Pending',
    youOwe: 'Pending'
  },
  {
    id: '2',
    expenseNumber: '537839',
    title: 'Swipe medical Expense (other options to create invoice)',
    date: 'Apr 7, 2025',
    status: 'NEW',
    totalBill: '$640.00',
    planPays: '$0.00',
    yourPortion: '$640.00',
    youOwe: '$0.00'
  },
  {
    id: '3',
    expenseNumber: '515120',
    title: 'Pharmacy Expense',
    date: 'Mar 5, 2025',
    status: 'NEW',
    totalBill: '$640.00',
    planPays: '$0.00',
    yourPortion: '$640.00',
    youOwe: '$0.00'
  }
];

export default function ExpenseDashboard() {
  const [showRecurring, setShowRecurring] = useState(false);
  const [showBeginning, setShowBeginning] = useState(false);
  const [showClaimStart, setShowClaimStart] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [claimStartType, setClaimStartType] = useState<'expense' | 'pharmacy'>('expense');

  const handleExpenseClick = (expense: Expense) => {
    if (expense.title === 'Swipe - Recurring Expense') {
      setShowRecurring(true);
    } else if (expense.title === 'Swipe medical Expense (other options to create invoice)') {
      setShowBeginning(true);
    } else if (expense.title === 'Pharmacy Expense') {
      setClaimStartType('pharmacy');
      setShowClaimStart(true);
    } else if (expense.title === 'Non-swipe Expense') {
      setClaimStartType('expense');
      setShowClaimStart(true);
    }
  };

  const handleAmountClick = (expense: Expense) => {
    if (
      expense.title === 'Swipe medical Expense (other options to create invoice)' ||
      expense.title === 'Pharmacy Expense'
    ) {
      setShowInvoice(true);
    }
  };

  const handleRestart = () => {
    setShowRecurring(false);
    setShowClaimStart(false);
    setShowBeginning(false);
    setShowInvoice(false);
    setClaimStartType('expense');
  };

  if (showInvoice) {
    return (
      <div className="bg-white">
        <Invoice 
          cptEntries={[
            { code: '99213', description: 'Provider Fee for the Therapy Session' }
          ]}
          memberDescription="Medical visit with provider"
          onReset={() => setShowInvoice(false)}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  if (showRecurring) {
    return <Recurring onRestart={handleRestart} />;
  }

  if (showBeginning) {
    return <Beginning 
      onBack={() => setShowBeginning(false)}
      onRestart={() => {
        setShowRecurring(false);
        setShowClaimStart(false);
        setShowBeginning(false);
        setClaimStartType('expense');
      }} 
    />;
  }

  if (showClaimStart) {
    return <ClaimStart 
      accessType={claimStartType} 
      onBack={() => setShowClaimStart(false)}
      onRestart={handleRestart}
    />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#1a237e] mb-8">Expenses</h1>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-gray-600">Expense</th>
                <th className="pb-4 text-gray-600">Status</th>
                <th className="pb-4 text-gray-600 text-right">Total bill</th>
                <th className="pb-4 text-gray-600 text-right">Plan pays</th>
                <th className="pb-4 text-gray-600 text-right">Your portion</th>
                <th className="pb-4 text-gray-600 text-right">You owe</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {EXPENSES.map((expense, index) => (
                <tr 
                  key={expense.id}
                  className={`border-t border-gray-200 ${(index === 0 || expense.title === 'Swipe medical Expense (other options to create invoice)' || expense.title === 'Pharmacy Expense' || expense.title === 'Non-swipe Expense') ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <td className="py-4" onClick={() => handleExpenseClick(expense)}>
                    <div className="font-medium text-[#2196f3] hover:text-[#1976d2]">
                      {expense.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expense #{expense.expenseNumber}
                    </div>
                    <div className="text-sm text-gray-500">{expense.date}</div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {expense.status}
                    </span>
                  </td>
                  <td 
                    className={`py-4 text-right ${expense.title === 'Swipe medical Expense (other options to create invoice)' ? 'cursor-pointer text-[#2196f3] hover:text-[#1976d2] hover:underline' : ''}`}
                    onClick={() => handleAmountClick(expense)}
                  >
                    {expense.totalBill}
                  </td>
                  <td className="py-4 text-right">{expense.planPays}</td>
                  <td className="py-4 text-right">{expense.yourPortion}</td>
                  <td className="py-4 text-right">{expense.youOwe}</td>
                  <td className="py-4 pl-4">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 