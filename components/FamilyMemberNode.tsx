import React from 'react';
import { Person, Gender } from '../types';
import { calculateAge } from '../services/gameService';
import { MaleIcon, FemaleIcon, SkullIcon, CrownIcon, LinkIcon, HeartIcon, UsersIcon, ExcommunicationIcon } from './icons';

interface FamilyMemberNodeProps {
  personId: string;
  allPeople: Record<string, Person>;
  currentYear: number;
  onSelectPerson: (personId: string | null) => void;
  selectedPersonDetailId: string | null;
  level: number; // Indentation level for children
  isRoot?: boolean; // Special styling for the root of a generation branch
  isLastChild?: boolean; // For drawing connector lines correctly
}

const PersonDisplayCard: React.FC<{
  person: Person;
  currentYear: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ person, currentYear, isSelected, onClick }) => {
  const age = calculateAge(person.birthYear, currentYear);
  const cardClasses = `p-2 rounded-md shadow-lg hover:shadow-xl transition-all w-60 cursor-pointer relative
                       ${!person.isAlive || person.isExcommunicated ? 'opacity-60' : ''}
                       ${isSelected ? 'ring-2 ring-amber-400 bg-[#6F6190]' : 'border border-purple-700 bg-[#5F5380] hover:bg-[#6F6190]'}`;
  const excommunicatedFilter = person.isExcommunicated ? 'filter-grayscale' : '';

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-center space-x-2">
        <img 
          src={person.portraitUrl} 
          alt={person.firstName} 
          className={`w-10 h-10 rounded-full border border-purple-600 ${excommunicatedFilter}`}
        />
        <div>
          <p className={`font-semibold ${person.isRoyalBlood && !person.isExcommunicated ? 'text-yellow-300' : 'text-sky-200'} flex items-center text-sm`}>
            {person.firstName} {person.lastName}
            {person.gender === Gender.Male ? <MaleIcon className="ml-1 text-blue-300 w-3 h-3" /> : <FemaleIcon className="ml-1 text-pink-300 w-3 h-3" />}
            {!person.isAlive && <SkullIcon className="ml-1 text-red-500 w-3 h-3" title="Deceased"/>}
            {person.isExcommunicated && <ExcommunicationIcon className="ml-1 text-gray-400 w-3 h-3" title="Excommunicated"/>}
            {person.isRoyalBlood && !person.isExcommunicated && <CrownIcon className="ml-1 text-yellow-400 w-3 h-3" title="Royal Blood"/>}
            {person.isMarriedToRoyal && !person.isRoyalBlood && !person.isExcommunicated && <LinkIcon className="ml-1 text-green-400 w-3 h-3" title="Married into Royalty"/>}
          </p>
          <p className="text-xs text-purple-300">
            {person.isAlive ? `Age: ${age}` : `Died: ${person.deathYear} (Age ${calculateAge(person.birthYear, person.deathYear!)})`}
            {`, Sts: ${person.statusPoints}`}
          </p>
          {person.isExcommunicated && <p className="text-xs text-red-400 font-semibold">Excommunicated</p>}
        </div>
      </div>
    </div>
  );
};


export const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({
  personId,
  allPeople,
  currentYear,
  onSelectPerson,
  selectedPersonDetailId,
  level,
  isRoot = false,
  isLastChild = false,
}) => {
  const person = allPeople[personId];
  if (!person) return null;

  const spouse = person.spouseId ? allPeople[person.spouseId] : null;
  const children = person.childrenIds.map(id => allPeople[id]).filter(Boolean);

  const isPersonSelected = selectedPersonDetailId === person.id;
  const isSpouseSelected = spouse && selectedPersonDetailId === spouse.id;
  
  const INDENT_SIZE = 2; // units (1 unit = 0.25rem) for padding, e.g. 8 -> 2rem
  const HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR = 1; // rem, how far to the right the child connector starts from the parent
  
  // Left padding for the entire node content block based on its level
  const nodePaddingLeft = level * INDENT_SIZE * 0.25; // in rem

  return (
    <div className="relative" style={{ paddingLeft: `${nodePaddingLeft}rem` }}>
      {/* --- PARENT/SPOUSE ROW --- */}
      <div className="flex items-center relative mb-2"> {/* mb-2 gives space for child connector */}
        {/* Connector line from parent (for non-root nodes) */}
        {!isRoot && (
          <>
            {/* Vertical part of the elbow connector */}
            <div 
              className="absolute border-l-2 border-purple-600"
              style={{ 
                left: `-${HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR}rem`, // Adjusted to HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR
                top: '-1rem', // Half height of node + margin/2
                height: isLastChild ? '2.75rem' : 'calc(100% + 1rem)', // Adjust height based on whether it's the last child
              }}
            />
            {/* Horizontal part of the elbow connector */}
            <div 
              className="absolute border-t-2 border-purple-600"
              style={{ 
                left: `-${HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR}rem`, 
                top: '1.75rem', // Align with center of card
                width: `${HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR}rem` 
              }}
            />
          </>
        )}

        <PersonDisplayCard 
          person={person} 
          currentYear={currentYear} 
          isSelected={isPersonSelected} 
          onClick={() => onSelectPerson(person.id)} 
        />

        {spouse && (
          <>
            <div className="flex items-center mx-2">
              <HeartIcon className="text-red-400 w-5 h-5" />
            </div>
            <PersonDisplayCard 
              person={spouse} 
              currentYear={currentYear} 
              isSelected={isSpouseSelected} 
              onClick={() => onSelectPerson(spouse.id)} 
            />
          </>
        )}
      </div>

      {/* --- CHILDREN BLOCK --- */}
      {children.length > 0 && (
        <div className="relative mt-1"> {/* mt-1 to space from parent row */}
          {/* Vertical connector line dropping from parent to children */}
          <div 
            className="absolute border-l-2 border-purple-600" 
            style={{ 
              left: `${HORIZONTAL_SPACING_FOR_CHILD_CONNECTOR * -0.25}rem`, // Position relative to children block
              top: 0, 
              height: '100%' 
            }}
          />
          <div className="ml-0"> {/* Children nodes don't need additional padding themselves, parent's padding handles it */}
            {children.map((child, index) => (
              <FamilyMemberNode
                key={child.id}
                personId={child.id}
                allPeople={allPeople}
                currentYear={currentYear}
                onSelectPerson={onSelectPerson}
                selectedPersonDetailId={selectedPersonDetailId}
                level={level + 1} // Children are one level deeper
                isRoot={false}
                isLastChild={index === children.length -1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};