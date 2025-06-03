
import React from 'react';
import { Person, Gender, ForeignDynastyDetails } from '../../types/index';
import { calculateAge } from '../../services/entities/person.service';
import { SimpleMaleIcon, SimpleFemaleIcon, SkullIcon, LinkIcon, HeartIcon, ExcommunicationIcon } from './icons';
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE } from '../../constants';

interface PersonCardProps {
  person: Person;
  currentYear: number;
  isSelected?: boolean;
  onSelect?: (personId: string) => void;
  onInitiateMarriage?: (royalId: string) => void;
  className?: string;
  showMarriageButton?: boolean;
}

const getBorderColorClass = (colorPrimary?: string) => {
  if (!colorPrimary) return 'border-teal-400'; 
  const colorMapping: Record<string, string> = {
    'bg-rose-700': 'border-rose-700',
    'bg-sky-700': 'border-sky-700',
    'bg-purple-700': 'border-purple-700',
    'bg-amber-600': 'border-amber-600',
    'bg-lime-600': 'border-lime-700',
    'bg-indigo-700': 'border-indigo-700',
  };
  return colorMapping[colorPrimary] || 'border-teal-400';
};


export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  currentYear,
  isSelected = false,
  onSelect,
  onInitiateMarriage,
  className = '',
  showMarriageButton = false
}) => {
  const age = calculateAge(person.birthYear, currentYear);

  const canMarry = person.isAlive &&
                   !person.spouseId &&
                   age >= MIN_MARRIAGE_AGE &&
                   !person.isExcommunicated &&
                   (person.isRoyalBlood || person.isMarriedToRoyal);

  const canHaveChildren = person.isAlive &&
                          !person.isExcommunicated &&
                          person.spouseId &&
                          person.gender === Gender.Female &&
                          age >= MIN_MARRIAGE_AGE &&
                          age <= MAX_CHILD_BEARING_AGE_FEMALE;

  const cardBaseClasses = `p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out relative`;
  const selectedClasses = isSelected ? 'ring-2 ring-pink-500 scale-105 bg-stone-200' : 'bg-stone-50 hover:bg-stone-100';
  const aliveClasses = !person.isAlive || person.isExcommunicated ? 'opacity-60' : '';
  const excommunicatedFilter = person.isExcommunicated ? 'filter-grayscale' : '';
  
  const borderColorClass = person.isForeignRoyal && person.foreignDynastyDetails 
    ? getBorderColorClass(person.foreignDynastyDetails.colorPrimary) 
    : 'border-teal-400';


  let originInfo = "";
  if (!person.isExcommunicated) {
    if (person.isRoyalBlood) {
      originInfo = `Born into: House of ${person.lastName}`;
    } else if (person.isMarriedToRoyal) {
      originInfo = `Married into: House of ${person.lastName} (from House of ${person.originalLastName})`;
    } else if (person.isForeignRoyal && person.foreignDynastyDetails) {
      originInfo = `Of ${person.foreignDynastyDetails.name}`;
    }
  }


  return ( 
    <div
      className={`${cardBaseClasses} ${selectedClasses} ${aliveClasses} ${className} ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect && onSelect(person.id)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(person.id) : undefined}
      aria-label={onSelect ? `Select ${person.firstName} ${person.lastName}` : undefined}
      aria-pressed={isSelected}
    >
      {person.isForeignRoyal && person.foreignDynastyDetails && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-xs rounded-full shadow ${person.foreignDynastyDetails.colorPrimary} ${person.foreignDynastyDetails.colorPrimary.includes('bg-') ? 'text-white' : ''} font-semibold z-10`}>
          Foreign Royal
        </div>
      )}
      {person.title === 'Socialite' && !person.isForeignRoyal && (
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 text-xs rounded-full shadow bg-green-600 text-white font-semibold z-10`}>
          Socialite
        </div>
      )}
      <div className="flex items-center space-x-3 pt-1">
        <img
          src={person.portraitUrl}
          alt={`${person.firstName} ${person.lastName}`}
          className={`w-16 h-16 rounded-full border-2 ${borderColorClass} ${excommunicatedFilter}`}
        />
        <div className="flex-grow">
          <h3 className={`text-lg font-semibold ${person.isForeignRoyal ? 'text-purple-700' : 'text-teal-700'} flex items-center`}>
            {person.title && person.title !== 'Socialite' ? `${person.title} ` : ''}{person.firstName} {person.lastName}
            {person.gender === Gender.Male ? <SimpleMaleIcon className="ml-2 text-blue-500 w-4 h-4" title="Male" /> : <SimpleFemaleIcon className="ml-2 text-pink-500 w-4 h-4" title="Female" />}
            {!person.isAlive && <SkullIcon className="ml-2 text-red-500 w-4 h-4" title="Deceased" />}
            {person.isExcommunicated && <ExcommunicationIcon className="ml-2 text-gray-500 w-4 h-4" title="Excommunicated"/>}
            {person.isMarriedToRoyal && !person.isRoyalBlood && !person.isExcommunicated && <LinkIcon className="ml-1 text-emerald-500 w-4 h-4" title="Married into Royalty"/>}
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            {person.isAlive ? `Age: ${age}` : `Died: ${person.deathYear} (Age ${calculateAge(person.birthYear, person.deathYear!)})`}
          </p>
          <p className="text-xs text-slate-500 font-sans">Status: {person.statusPoints}</p>
          {person.isExcommunicated && <p className="text-xs text-red-500 font-semibold font-sans">Excommunicated</p>}
        </div>
      </div>

      {isSelected && (
        <div className="mt-2 pt-2 border-t border-stone-300 text-xs text-slate-600 font-sans">
          <p>Country: {person.originCountry}</p>
          {originInfo && <p className="font-sans">{originInfo}</p>}
          <p>Generation: {person.generation}</p>
          {person.isAlive && person.spouseId && !person.isExcommunicated && (
             <p className="flex items-center"><HeartIcon className="mr-1 text-red-500 w-4 h-4" /> Married</p>
          )}
           {person.isAlive && canHaveChildren && (
             <p className="text-teal-600">Can have children</p>
          )}
        </div>
      )}

      {showMarriageButton && canMarry && onInitiateMarriage && (
        <button
          onClick={(e) => { e.stopPropagation(); onInitiateMarriage(person.id); }}
          className="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-2 rounded text-sm transition-colors font-sans"
        >
          Arrange Marriage
        </button>
      )}
    </div>
  );
};
