
import React from 'react';
import { Person } from '../../types/index';
import { PersonCard } from '../shared/PersonCard'; 

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
    <div className="p-4 bg-white rounded-lg shadow-lg h-full overflow-y-auto custom-scrollbar">
      <h3 className="text-xl font-semibold text-teal-700 mb-4 sticky top-0 bg-white py-2 z-10 border-b border-stone-200">
        Potential Suitors
      </h3>
      {suitors.length === 0 && <p className="text-slate-500 font-sans">No suitors available this year.</p>}
      <div className="space-y-3">
        {suitors.map(suitor => (
          <div key={suitor.id} className="bg-stone-50 p-3 rounded-md shadow">
             <PersonCard person={suitor} currentYear={currentYear} />
             {selectedRoyalIdForMarriage && !suitor.isExcommunicated && (
                <button
                    onClick={() => onSelectSuitorForMarriage(suitor.id)}
                    className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2 rounded text-sm transition-colors font-sans"
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
