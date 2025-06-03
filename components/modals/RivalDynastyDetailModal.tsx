
import React from 'react';
import { RivalDynasty, RivalPerson, Gender, RivalDynastyColorScheme } from '../../types/index';
import { calculateAge } from '../../services/entities/person.service'; 
import { SimpleMaleIcon, SimpleFemaleIcon, SkullIcon, HandshakeIcon } from '../shared/icons'; 

interface RivalDynastyDetailModalProps {
  isOpen: boolean;
  onClose: () => void; 
  rivalDynasty: RivalDynasty | null;
  currentYear: number;
  onAttemptDiplomaticAlliance: (rivalId: string) => void; 
  playerAlliances: string[];
  diplomaticAttempts: Record<string, number>;
}

const RivalPersonCard: React.FC<{ person: RivalPerson, currentYear: number, colorScheme: RivalDynastyColorScheme }> = ({ person, currentYear, colorScheme }) => {
  const age = calculateAge(person.birthYear, currentYear);
  return ( 
    <div className={`p-2 rounded border ${colorScheme.accent} ${colorScheme.secondary} mb-2`}>
      <div className="flex items-center space-x-2">
        <img
          src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${person.id}_rival`}
          alt={`${person.firstName} ${person.lastName}`}
          className={`w-10 h-10 rounded-full border-2 ${colorScheme.accent.replace('border-', 'border-')}`}
        />
        <div>
          <p className={`font-semibold ${colorScheme.textOnSecondary} flex items-center text-sm`}>
            {person.title ? `${person.title} ` : ''}{person.firstName} {person.lastName}
            {person.gender === Gender.Male ? <SimpleMaleIcon className="ml-1 text-blue-400 w-3 h-3" title="Male"/> : <SimpleFemaleIcon className="ml-1 text-pink-400 w-3 h-3" title="Female"/>}
            {!person.isAlive && <SkullIcon className="ml-1 text-red-400 w-3 h-3" title="Deceased"/>}
          </p>
          <p className={`text-xs ${colorScheme.textOnSecondary} opacity-80 font-sans`}>
            {person.isAlive ? `Age: ${age}` : `Died: ${person.deathYear} (Age ${calculateAge(person.birthYear, person.deathYear!)})`}
            {`, Sts: ${person.statusPoints}`}
          </p>
        </div>
      </div>
      {person.spouseInfo && person.isAlive && (
        <p className={`text-xs mt-1 pl-1 ${colorScheme.textOnSecondary} opacity-80 font-sans`}>Spouse: {person.spouseInfo.firstName} (Sts: {person.spouseInfo.statusPoints})</p>
      )}
    </div>
  );
};

export const RivalDynastyDetailModal: React.FC<RivalDynastyDetailModalProps> = ({
  isOpen,
  onClose,
  rivalDynasty,
  currentYear,
  onAttemptDiplomaticAlliance,
  playerAlliances,
  diplomaticAttempts
}) => {
  if (!isOpen || !rivalDynasty) return null;

  const monarch = rivalDynasty.currentMonarchId ? rivalDynasty.members[rivalDynasty.currentMonarchId] : null;
  const yearsEstablished = currentYear - rivalDynasty.dynastyFoundedYear;
  const livingMembers = Object.values(rivalDynasty.members).filter(m => m.isAlive);
  const prominentMembers = livingMembers
    .sort((a, b) => {
        if (a.id === rivalDynasty.currentMonarchId) return -1;
        if (b.id === rivalDynasty.currentMonarchId) return 1;
        if (a.title && !b.title) return -1;
        if (!a.title && b.title) return 1;
        return b.statusPoints - a.statusPoints || a.birthYear - b.birthYear;
    })
    .slice(0, 10);

  const isAllied = playerAlliances.includes(rivalDynasty.id);
  const attemptsMade = diplomaticAttempts[rivalDynasty.id] || 0;

  const { primary, secondary, accent, textOnPrimary, textOnSecondary } = rivalDynasty.colorScheme;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rival-dynasty-detail-title"
    >
      <div
        className={`p-0 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${secondary} ${accent} border-4`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`px-6 py-4 ${primary} rounded-t-sm`}>
          <div className="flex justify-between items-center">
            <h2 id="rival-dynasty-detail-title" className={`text-2xl font-bold ${textOnPrimary}`}>
              {rivalDynasty.name}
            </h2>
            <button
              onClick={onClose}
              className={`${textOnPrimary} hover:opacity-75 text-3xl font-bold`}
              aria-label="Close rival dynasty details"
            >
              &times;
            </button>
          </div>
          <p className={`text-sm ${textOnPrimary} opacity-90`}>{rivalDynasty.country}</p>
        </div>

        <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
          <div className={`p-3 mb-4 rounded ${primary} ${textOnPrimary} text-center`}>
            <p className="text-sm uppercase tracking-wider">Alliance Status</p>
            {isAllied ? (
              <p className="text-lg font-semibold flex items-center justify-center"><HandshakeIcon className={`mr-2 ${textOnPrimary}`} title="Allied" /> Allied with Your Dynasty</p>
            ) : (
              <p className="text-lg font-semibold">Not Allied</p>
            )}
            {!isAllied && attemptsMade > 0 && (
              <p className="text-xs opacity-80 mt-1">Diplomatic Attempts Made: {attemptsMade}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`p-3 ${secondary} rounded ${accent} border`}>
              <p className={`text-xs ${textOnSecondary} opacity-80 uppercase`}>Current Monarch</p>
              <p className={`text-lg font-semibold ${textOnSecondary}`}>
                {monarch ? `${monarch.title || ''} ${monarch.firstName} ${monarch.lastName}` : 'Interregnum'}
              </p>
            </div>
            <div className={`p-3 ${secondary} rounded ${accent} border`}>
              <p className={`text-xs ${textOnSecondary} opacity-80 uppercase`}>Overall Status</p>
              <p className={`text-lg font-semibold ${textOnSecondary}`}>{rivalDynasty.status.toFixed(2)}</p>
            </div>
            <div className={`p-3 ${secondary} rounded ${accent} border`}>
              <p className={`text-xs ${textOnSecondary} opacity-80 uppercase`}>Treasury</p>
              <p className={`text-lg font-semibold ${textOnSecondary}`}>{rivalDynasty.treasury} gold</p>
            </div>
            <div className={`p-3 ${secondary} rounded ${accent} border`}>
              <p className={`text-xs ${textOnSecondary} opacity-80 uppercase`}>Established</p>
              <p className={`text-lg font-semibold ${textOnSecondary}`}>{yearsEstablished} yrs (Est. {rivalDynasty.dynastyFoundedYear})</p>
            </div>
             <div className={`p-3 ${secondary} rounded ${accent} border col-span-2`}>
              <p className={`text-xs ${textOnSecondary} opacity-80 uppercase`}>Living Members</p>
              <p className={`text-lg font-semibold ${textOnSecondary}`}>{livingMembers.length}</p>
            </div>
          </div>

          {!isAllied && (
            <button
              onClick={() => onAttemptDiplomaticAlliance(rivalDynasty.id)}
              className={`w-full py-2 px-4 rounded transition-colors font-sans font-semibold mb-4
                          ${primary} ${textOnPrimary} hover:opacity-80 ${accent} border`}
            >
              Attempt Diplomatic Alliance
            </button>
          )}

          <h3 className={`text-lg font-semibold ${textOnPrimary.startsWith('text-') ? textOnPrimary : 'text-gray-700'} ${primary.includes('bg-') ? '' : primary} mb-2`}>Prominent Living Members:</h3>
          {prominentMembers.length > 0 ? (
            prominentMembers.map(member => (
              <RivalPersonCard key={member.id} person={member} currentYear={currentYear} colorScheme={rivalDynasty.colorScheme} />
            ))
          ) : (
            <p className={`italic ${textOnSecondary}`}>No prominent members found.</p>
          )}
        </div>
         <div className={`px-6 py-3 mt-auto ${primary} rounded-b-sm`}>
            <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded transition-colors font-sans font-semibold ${secondary} ${textOnSecondary} hover:opacity-80 ${accent} border`}
            >
            Close
            </button>
        </div>
      </div>
    </div>
  );
};
