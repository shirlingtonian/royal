import React from 'react';
import { Person } from '../types';
import { PersonCard } from './PersonCard';

interface PotentialSuitorsPanelProps {
  suitors: Person[];
  currentYear: number;
  selectedRoyalIdForMarriage: string | null; 
  onSelectSuitorForMarriage: (suitorId: string) => void; 
}

export const PotentialSuitorsPanel: React.FC<PotentialSuitorsPanelProps> = ({
  suitors,
  currentYear,
  selectedRoyalIdForMarriage,
  onSelectSuitorForMarriage
}) => {
  return (
    <div className="p-4 bg-[#4A3F6A] rounded-lg shadow-lg h-full overflow-y-auto">
      <h3 className="text-xl font-semibold text-sky-300 mb-4 sticky top-0 bg-[#4A3F6A] py-2 z-10">
        Potential Suitors
      </h3>
      {suitors.length === 0 && <p className="text-purple-300">No suitors available this year.</p>}
      <div className="space-y-3">
        {suitors.map(suitor => (
          <div key={suitor.id} className="bg-[#5F5380] p-3 rounded-md shadow">
             <PersonCard person={suitor} currentYear={currentYear} />
             {selectedRoyalIdForMarriage && !suitor.isExcommunicated && (
                <button
                    onClick={() => onSelectSuitorForMarriage(suitor.id)}
                    className="mt-2 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors"
                >
                    Marry to Selected Royal
                </button>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};