
import React from 'react';
import { Person } from '../../types/index';
import { PersonCard } from '../shared/PersonCard'; 
import { calculateAge } from '../../services/entities/person.service'; 
import { MIN_MARRIAGE_AGE } from '../../constants';

interface MarriageModalProps {
  isOpen: boolean;
  onClose: () => void; 
  royalPerson: Person | null;
  suitors: Person[]; 
  relatedRoyalSuitors: Person[]; 
  currentYear: number;
  onConfirmMarriage: (royalId: string, suitorId: string) => void; 
  dynastyName: string;
}

export const MarriageModal: React.FC<MarriageModalProps> = ({
  isOpen,
  onClose,
  royalPerson,
  suitors,
  relatedRoyalSuitors,
  currentYear,
  onConfirmMarriage,
  dynastyName
}) => {
  if (!isOpen || !royalPerson) return null;

  const eligibleExternalSuitors = suitors.filter(s => 
    !s.isExcommunicated &&
    calculateAge(s.birthYear, currentYear) >= MIN_MARRIAGE_AGE && 
    s.gender !== royalPerson.gender &&
    !s.spouseId
  );

  const eligibleRelatedSuitors = relatedRoyalSuitors.filter(s => !s.spouseId && s.gender !== royalPerson.gender && calculateAge(s.birthYear, currentYear) >= MIN_MARRIAGE_AGE && !s.isExcommunicated);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col text-slate-800">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">
          Arrange Marriage for {royalPerson.title ? `${royalPerson.title} ` : ''}{royalPerson.firstName} {royalPerson.lastName}
        </h2>
        <div className="mb-4 p-3 bg-stone-50 rounded">
            <PersonCard person={royalPerson} currentYear={currentYear} isSelected={true}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 flex-grow overflow-hidden">
            <div className="flex flex-col overflow-hidden">
                <h3 className="text-lg font-semibold text-teal-600 mb-2 sticky top-0 bg-white pt-1 z-10">Dynastic Relations</h3>
                {eligibleRelatedSuitors.length === 0 && <p className="text-slate-500 mb-4 font-sans text-sm">No eligible relations found within the dynasty.</p>}
                <div className="overflow-y-auto space-y-3 pr-2 flex-grow custom-scrollbar">
                {eligibleRelatedSuitors.map(relatedSuitor => ( // Renamed suitor to relatedSuitor to avoid conflict if any
                    <div 
                    key={relatedSuitor.id} 
                    className="bg-teal-50 border border-teal-200 p-3 rounded-md shadow-sm hover:bg-teal-100 transition-colors cursor-pointer" 
                    onClick={() => onConfirmMarriage(royalPerson.id, relatedSuitor.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onConfirmMarriage(royalPerson.id, relatedSuitor.id)}
                    aria-label={`Marry ${royalPerson.firstName} to ${relatedSuitor.firstName}`}
                    >
                    <PersonCard person={relatedSuitor} currentYear={currentYear} />
                    <p className="text-xs text-center mt-1 text-teal-600 font-sans">Click to marry this relation</p>
                    </div>
                ))}
                </div>
            </div>

            <div className="flex flex-col overflow-hidden mt-4 md:mt-0">
                <h3 className="text-lg font-semibold text-teal-600 mb-2 sticky top-0 bg-white pt-1 z-10">External Suitors</h3>
                {eligibleExternalSuitors.length === 0 && <p className="text-slate-500 mb-4 font-sans text-sm">No eligible external suitors available.</p>}
                <div className="overflow-y-auto space-y-3 pr-2 flex-grow custom-scrollbar">
                {eligibleExternalSuitors.map(externalSuitor => ( // Renamed suitor to externalSuitor
                    <div 
                    key={externalSuitor.id} 
                    className="bg-stone-50 p-3 rounded-md shadow-md hover:bg-stone-100 transition-colors cursor-pointer" 
                    onClick={() => onConfirmMarriage(royalPerson.id, externalSuitor.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onConfirmMarriage(royalPerson.id, externalSuitor.id)}
                    aria-label={`Marry ${royalPerson.firstName} to ${externalSuitor.firstName}`}
                    >
                    <PersonCard person={externalSuitor} currentYear={currentYear} />
                    <p className="text-xs text-center mt-1 text-teal-600 font-sans">Click to marry this suitor</p>
                    </div>
                ))}
                </div>
            </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors w-full font-sans"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
