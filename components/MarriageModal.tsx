import React from 'react';
import { Person } from '../types';
import { PersonCard } from './PersonCard'; 
import { calculateAge } from '../services/gameService';
import { MIN_MARRIAGE_AGE } from '../constants';

interface MarriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  royalPerson: Person | null;
  suitors: Person[];
  currentYear: number;
  onConfirmMarriage: (royalId: string, suitorId: string) => void;
  dynastyName: string;
}

export const MarriageModal: React.FC<MarriageModalProps> = ({
  isOpen,
  onClose,
  royalPerson,
  suitors,
  currentYear,
  onConfirmMarriage,
  dynastyName
}) => {
  if (!isOpen || !royalPerson) return null;

  const eligibleSuitors = suitors.filter(s => 
    !s.isExcommunicated &&
    calculateAge(s.birthYear, currentYear) >= MIN_MARRIAGE_AGE && 
    s.gender !== royalPerson.gender
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#4A3F6A] p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          Arrange Marriage for {royalPerson.firstName} {royalPerson.lastName}
        </h2>
        <div className="mb-4 p-3 bg-[#5F5380] rounded">
            <PersonCard person={royalPerson} currentYear={currentYear} isSelected={true}/>
        </div>

        <h3 className="text-lg font-semibold text-sky-300 mb-2">Select a Suitor:</h3>
        {eligibleSuitors.length === 0 && <p className="text-purple-300 mb-4">No eligible suitors available for {royalPerson.firstName}.</p>}
        <div className="overflow-y-auto space-y-3 pr-2 flex-grow mb-4 max-h-80">
          {eligibleSuitors.map(suitor => (
            <div 
              key={suitor.id} 
              className="bg-[#5F5380] p-3 rounded-md shadow-md hover:bg-[#6F6190] transition-colors cursor-pointer" 
              onClick={() => onConfirmMarriage(royalPerson.id, suitor.id)}
            >
              <PersonCard person={suitor} currentYear={currentYear} />
               <p className="text-xs text-center mt-1 text-amber-200">Click to marry this suitor</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-auto bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded transition-colors w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};