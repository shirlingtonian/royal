
import React from 'react';
import { RivalDynasty } from '../../types/index';
import { CrownIcon, HandshakeIcon } from '../shared/icons'; 

interface RivalDynastiesPanelProps {
  playerDynastyName: string;
  playerDynastyStatus: number;
  rivalDynasties: RivalDynasty[];
  onSelectRival: (rivalId: string) => void; 
  playerAlliances: string[]; 
}

export const RivalDynastiesPanel: React.FC<RivalDynastiesPanelProps> = ({
  playerDynastyName,
  playerDynastyStatus,
  rivalDynasties,
  onSelectRival,
  playerAlliances,
}) => {
  const allDynasties = [
    { 
      id: 'player', 
      name: playerDynastyName, 
      status: playerDynastyStatus, 
      isPlayer: true, 
      country: "Kingdom of England", 
      colorScheme: { primary: 'bg-teal-500', secondary: 'bg-teal-300', accent: 'border-teal-600', textOnPrimary: 'text-white', textOnSecondary: 'text-teal-800' } 
    }, 
    ...rivalDynasties.map(d => ({ ...d, isPlayer: false })),
  ];

  allDynasties.sort((a, b) => b.status - a.status);

  return (
    <div className="p-4 h-full bg-white">
      <h3 className="text-xl font-semibold text-teal-700 mb-4 sticky top-0 bg-white py-2 z-10 border-b border-stone-200">
        Royal Leaderboard
      </h3>
      {allDynasties.length === 1 && rivalDynasties.length === 0 && <p className="text-slate-500 font-sans">No other major houses are currently tracked.</p>}
      <ul className="space-y-2">
        {allDynasties.map((dynastyItem, index) => { 
          const isAllied = !dynastyItem.isPlayer && playerAlliances.includes(dynastyItem.id);
          return ( 
            <li
              key={dynastyItem.id}
              className={`p-3 rounded-md shadow-sm flex justify-between items-center transition-colors
                          ${dynastyItem.isPlayer ? 'bg-teal-50 border-l-4 border-teal-500' 
                                            : `${dynastyItem.colorScheme.secondary} ${dynastyItem.colorScheme.accent.replace('border-', 'border-l-4 border-')}` }
                          ${!dynastyItem.isPlayer ? 'hover:opacity-80 cursor-pointer' : ''}`}
              onClick={!dynastyItem.isPlayer ? () => onSelectRival(dynastyItem.id) : undefined}
              role={!dynastyItem.isPlayer ? "button" : undefined}
              tabIndex={!dynastyItem.isPlayer ? 0 : undefined}
              onKeyDown={!dynastyItem.isPlayer ? (e) => (e.key === 'Enter' || e.key === ' ') && onSelectRival(dynastyItem.id) : undefined}
              aria-label={!dynastyItem.isPlayer ? `View details for ${dynastyItem.name}` : undefined}
            >
              <div className="flex items-center overflow-hidden">
                <span className={`mr-2 font-medium font-sans ${dynastyItem.isPlayer ? 'text-slate-500' : dynastyItem.colorScheme.textOnSecondary}` }>#{index + 1}</span>
                <div className="overflow-hidden"> 
                  <span className={`font-semibold truncate ${dynastyItem.isPlayer ? 'text-teal-700' : dynastyItem.colorScheme.textOnPrimary } ${dynastyItem.colorScheme.primary.includes('bg-') ? '' : dynastyItem.colorScheme.primary }`}> 
                    {dynastyItem.name}
                  </span>
                  <span className={`block text-xs font-sans truncate ${dynastyItem.isPlayer ? 'text-teal-600/90' : `${dynastyItem.colorScheme.textOnSecondary} opacity-80`}`}>{dynastyItem.country}</span>
                </div>

                {dynastyItem.isPlayer && <CrownIcon className="ml-2 text-teal-600 w-4 h-4 flex-shrink-0" title="Your Dynasty" />}
                {isAllied && <HandshakeIcon className={`ml-2 ${dynastyItem.colorScheme.textOnPrimary} w-4 h-4 flex-shrink-0`} title="Allied" />}
              </div>
              <span className={`font-bold text-lg font-sans ml-2 flex-shrink-0 ${dynastyItem.isPlayer ? 'text-teal-600' : dynastyItem.colorScheme.textOnPrimary } ${dynastyItem.colorScheme.primary.includes('bg-') ? '' : dynastyItem.colorScheme.primary }`}>
                {dynastyItem.status.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
