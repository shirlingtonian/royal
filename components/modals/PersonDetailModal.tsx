
import React from 'react';
import { Person } from '../../types/index';
import { SelectedPersonDetailPanel } from '../panels/SelectedPersonDetailPanel'; 

interface PersonDetailModalProps {
  isOpen: boolean;
  onClose: () => void; 
  person: Person | null;
  currentYear: number;
  dynastyFounderId: string | null;
  onInitiateMarriage: (royalId: string) => void;
  onTryForChild: (motherId: string) => void;
  onExcommunicate: (personId: string) => void;
  onRemovePersonFromTree: (personId: string) => void;
  allPeople: Record<string, Person>;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  isOpen,
  onClose,
  person,
  currentYear,
  dynastyFounderId,
  onInitiateMarriage,
  onTryForChild,
  onExcommunicate,
  onRemovePersonFromTree,
  allPeople
}) => {
  if (!isOpen || !person) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
        onClick={onClose} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-detail-modal-title" 
    >
      <div 
        className="bg-white p-0 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col text-slate-800"
        onClick={e => e.stopPropagation()} 
      >
        <SelectedPersonDetailPanel
            person={person}
            currentYear={currentYear}
            dynastyFounderId={dynastyFounderId}
            onInitiateMarriage={onInitiateMarriage}
            onTryForChild={onTryForChild}
            onExcommunicate={onExcommunicate}
            onRemovePersonFromTree={onRemovePersonFromTree}
            allPeople={allPeople}
            onClose={onClose} 
        />
      </div>
    </div>
  );
};
