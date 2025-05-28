import React from 'react';
import { Person, Gender } from '../types';
import { PersonCard } from './PersonCard'; 
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE } from '../constants';
import { calculateAge } from '../services/gameService';

interface SelectedPersonDetailPanelProps {
  person: Person | null;
  currentYear: number;
  dynastyFounderId: string | null; // Needed to prevent excommunicating founder
  onInitiateMarriage: (royalId: string) => void;
  onTryForChild: (motherId: string) => void;
  onExcommunicate: (personId: string) => void;
  allPeople: Record<string, Person>; 
}

export const SelectedPersonDetailPanel: React.FC<SelectedPersonDetailPanelProps> = ({
  person,
  currentYear,
  dynastyFounderId,
  onInitiateMarriage,
  onTryForChild,
  onExcommunicate,
  allPeople
}) => {
  if (!person) {
    return (
      <div className="p-4 bg-[#4A3F6A] rounded-lg shadow-lg h-full flex items-center justify-center">
        <p className="text-purple-300">Select a person from the family tree to see details.</p>
      </div>
    );
  }

  const age = calculateAge(person.birthYear, currentYear);
  const canMarry = person.isAlive &&
                   !person.spouseId &&
                   !person.isExcommunicated &&
                   age >= MIN_MARRIAGE_AGE &&
                   (person.isRoyalBlood); 

  const spouse = person.spouseId ? allPeople[person.spouseId] : null;
  const children = person.childrenIds.map(id => allPeople[id]).filter(Boolean);

  const canTryForKids = person.gender === Gender.Female &&
                        person.isAlive &&
                        !person.isExcommunicated &&
                        person.spouseId &&
                        allPeople[person.spouseId]?.isAlive &&
                        !allPeople[person.spouseId]?.isExcommunicated &&
                        age >= MIN_MARRIAGE_AGE &&
                        age <= MAX_CHILD_BEARING_AGE_FEMALE;

  const canBeExcommunicated = person.isAlive &&
                              !person.isExcommunicated &&
                              person.id !== dynastyFounderId;


  return (
    <div className="p-4 bg-[#4A3F6A] rounded-lg shadow-lg h-full overflow-y-auto">
      <h3 className="text-xl font-semibold text-sky-300 mb-4 sticky top-0 bg-[#4A3F6A] py-2 z-10">
        Selected Member Details
      </h3>
      <PersonCard
        person={person}
        currentYear={currentYear}
        isSelected={true} 
        className="mb-4"
      />
      
      <div className="space-y-2 text-sm text-purple-200 mb-4">
        <p><span className="font-semibold text-purple-300">Born:</span> Year {person.birthYear} in {person.originCountry}</p>
        {person.fatherId && allPeople[person.fatherId] && <p><span className="font-semibold text-purple-300">Father:</span> {allPeople[person.fatherId].firstName} {allPeople[person.fatherId].lastName}</p>}
        {person.motherId && allPeople[person.motherId] && <p><span className="font-semibold text-purple-300">Mother:</span> {allPeople[person.motherId].firstName} {allPeople[person.motherId].lastName}</p>}
      </div>

      {spouse && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-100 mb-1">Spouse:</h4>
          <PersonCard person={spouse} currentYear={currentYear} onSelect={(id) => {/* Maybe navigate to spouse? */}}/>
        </div>
      )}

      {children.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-100 mb-1">Children:</h4>
          <div className="space-y-2">
            {children.map(child => (
              <PersonCard key={child.id} person={child} currentYear={currentYear} onSelect={(id) => {/* Maybe navigate to child? */}}/>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3 mt-4">
        {canMarry && (
          <button
            onClick={() => onInitiateMarriage(person.id)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-purple-900 font-semibold py-2 px-4 rounded transition-colors shadow-md"
          >
            Arrange Marriage for {person.firstName}
          </button>
        )}

        {canTryForKids && (
           <button
            onClick={() => onTryForChild(person.id)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors shadow-md"
          >
            Try for Child with {allPeople[person.spouseId!]?.firstName}
          </button>
        )}

        {canBeExcommunicated && (
          <button
            onClick={() => onExcommunicate(person.id)}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded transition-colors shadow-md"
          >
            Excommunicate {person.firstName}
          </button>
        )}
      </div>

      {!person.isAlive && (
        <p className="text-center text-red-300 font-semibold p-2 bg-red-900 rounded mt-4">This person is deceased.</p>
      )}
      {person.isExcommunicated && (
         <p className="text-center text-gray-300 font-semibold p-2 bg-gray-700 rounded mt-4">This person is excommunicated.</p>
      )}
    </div>
  );
};