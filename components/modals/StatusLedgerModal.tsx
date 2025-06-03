
import React from 'react';
import { Person } from '../../types/index';
import { calculateAge } from '../../services/entities/person.service';
import { ExcommunicationIcon } from '../shared/icons';

interface StatusLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPeople: Record<string, Person>;
  currentYear: number;
  dynastyName: string;
  dynastyFounderId: string | null;
  onExcommunicate: (personId: string) => void;
}

export const StatusLedgerModal: React.FC<StatusLedgerModalProps> = ({
  isOpen,
  onClose,
  allPeople,
  currentYear,
  dynastyName,
  dynastyFounderId,
  onExcommunicate,
}) => {
  if (!isOpen) return null;

  const playerDynastyBaseName = dynastyName.replace("House of ", "");

  const dynastyMembers = Object.values(allPeople)
    .filter(p => p.isAlive && !p.isExcommunicated && p.lastName === playerDynastyBaseName)
    .sort((a, b) => b.statusPoints - a.statusPoints); // Highest status first

  const canBeExcommunicated = (person: Person): boolean => {
    return person.isAlive &&
           !person.isExcommunicated &&
           (person.id !== dynastyFounderId || Object.values(allPeople).filter(p => p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.id !== person.id && p.lastName === person.lastName).length > 0);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-ledger-title"
    >
      <div
        className="bg-stone-100 p-6 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="status-ledger-title" className="text-2xl font-bold text-yellow-900">
            Dynasty Status Ledger
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 text-3xl font-bold"
            aria-label="Close status ledger"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-grow pr-2">
          {dynastyMembers.length === 0 ? (
            <p className="text-slate-500 text-center">No living members in the dynasty.</p>
          ) : (
            <ul className="space-y-3">
              {dynastyMembers.map(person => {
                const age = calculateAge(person.birthYear, currentYear);
                const isExcommEligible = canBeExcommunicated(person);
                return (
                  <li key={person.id} className="bg-stone-50 p-3 rounded-md shadow-sm border border-stone-300 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-grow overflow-hidden">
                      <img
                        src={person.portraitUrl}
                        alt={`${person.firstName}`}
                        className="w-12 h-12 rounded-full border-2 border-stone-400 flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-teal-700 truncate text-sm">
                          {person.title ? `${person.title} ` : ''}{person.firstName} {person.lastName}
                        </p>
                        <p className="text-xs text-slate-600 font-sans">
                          Age: {age}, Status: <span className="font-medium">{person.statusPoints}</span>
                        </p>
                      </div>
                    </div>
                    {isExcommEligible ? (
                      <button
                        onClick={() => onExcommunicate(person.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors shadow-sm flex items-center gap-1 flex-shrink-0 font-sans"
                        title={`Excommunicate ${person.firstName}`}
                        aria-label={`Excommunicate ${person.firstName}`}
                      >
                        <ExcommunicationIcon className="w-3 h-3" />
                        Excommunicate
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-slate-300 text-slate-500 font-semibold py-1.5 px-3 rounded text-xs cursor-not-allowed flex items-center gap-1 flex-shrink-0 font-sans"
                        title={person.isExcommunicated ? "Already excommunicated" : "Cannot excommunicate"}
                        aria-label={person.isExcommunicated ? "Already excommunicated" : "Cannot excommunicate"}
                      >
                         <ExcommunicationIcon className="w-3 h-3" />
                        Excommunicate
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-yellow-700 hover:bg-yellow-800 text-white py-2.5 px-4 rounded transition-colors w-full font-sans font-semibold"
        >
          Close Ledger
        </button>
      </div>
    </div>
  );
};
