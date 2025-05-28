import React from 'react';
import { Person, Gender } from '../types';
import { calculateAge } from '../services/gameService';
import { MaleIcon, FemaleIcon, SkullIcon, CrownIcon, LinkIcon, HeartIcon, ExcommunicationIcon } from './icons'; 
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE } from '../constants';

interface PersonCardProps {
  person: Person;
  currentYear: number;
  isSelected?: boolean;
  onSelect?: (personId: string) => void;
  onInitiateMarriage?: (royalId: string) => void;
  className?: string;
  showMarriageButton?: boolean;
}

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
  
  const cardBaseClasses = `p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out`;
  const selectedClasses = isSelected ? 'ring-2 ring-amber-400 scale-105 bg-[#6F6190]' : 'bg-[#5F5380] hover:bg-[#6F6190]';
  const aliveClasses = !person.isAlive || person.isExcommunicated ? 'opacity-60' : '';
  const excommunicatedFilter = person.isExcommunicated ? 'filter-grayscale' : '';

  return (
    <div
      className={`${cardBaseClasses} ${selectedClasses} ${aliveClasses} ${className} ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect && onSelect(person.id)}
    >
      <div className="flex items-center space-x-3">
        <img 
          src={person.portraitUrl} 
          alt={`${person.firstName} ${person.lastName}`} 
          className={`w-16 h-16 rounded-full border-2 border-purple-700 ${excommunicatedFilter}`} 
        />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-sky-200 flex items-center">
            {person.firstName} {person.lastName}
            {person.gender === Gender.Male ? <MaleIcon className="ml-2 text-blue-300" /> : <FemaleIcon className="ml-2 text-pink-300" />}
            {!person.isAlive && <SkullIcon className="ml-2 text-red-400" title="Deceased" />}
            {person.isExcommunicated && <ExcommunicationIcon className="ml-2 text-gray-400" title="Excommunicated"/>}
            {person.isRoyalBlood && !person.isExcommunicated && <CrownIcon className="ml-1 text-yellow-300" title="Royal Blood" />}
            {person.isMarriedToRoyal && !person.isRoyalBlood && !person.isExcommunicated && <LinkIcon className="ml-1 text-green-300" title="Married into Royalty"/>}
          </h3>
          <p className="text-xs text-purple-300">
            {person.isAlive ? `Age: ${age}` : `Died: ${person.deathYear} (Age ${calculateAge(person.birthYear, person.deathYear!)})`}
          </p>
          <p className="text-xs text-purple-300">Status: {person.statusPoints}</p>
          {person.isExcommunicated && <p className="text-xs text-red-400 font-semibold">Excommunicated</p>}
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-2 pt-2 border-t border-purple-700 text-xs text-purple-200">
          <p>Country: {person.originCountry}</p>
          <p>Features: {person.physicalFeatures.join(', ')}</p>
          <p>Generation: {person.generation}</p>
          {person.isAlive && person.spouseId && !person.isExcommunicated && (
             <p className="flex items-center"><HeartIcon className="mr-1 text-red-400" /> Married</p>
          )}
           {person.isAlive && canHaveChildren && (
             <p className="text-green-300">Can have children</p>
          )}
        </div>
      )}

      {showMarriageButton && canMarry && onInitiateMarriage && (
        <button
          onClick={(e) => { e.stopPropagation(); onInitiateMarriage(person.id); }}
          className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-purple-900 font-semibold py-1 px-2 rounded text-sm transition-colors"
        >
          Arrange Marriage
        </button>
      )}
    </div>
  );
};