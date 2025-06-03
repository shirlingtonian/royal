
import React from 'react';
import { Person, Gender } from '../../types/index';
import { calculateAge } from '../../services/entities/person.service';
import { SimpleMaleIcon, SimpleFemaleIcon, SkullIcon, LinkIcon, HeartIcon, ExcommunicationIcon } from '../shared/icons';
// import { ArcherElement } from 'react-archer'; // Temporarily removed

// Define local types for react-archer relations as it doesn't export ArcherRelation
type AnchorPosition = 'top' | 'bottom' | 'left' | 'right' | 'middle';

interface LocalArcherRelation {
  targetId: string;
  targetAnchor: AnchorPosition;
  sourceAnchor: AnchorPosition;
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  label?: React.ReactNode;
}

interface FamilyMemberNodeProps {
  personId: string;
  allPeople: Record<string, Person>;
  currentYear: number;
  onSelectPerson: (personId: string | null) => void;
  selectedPersonDetailId: string | null;
  level: number;
  dynastyFounderId: string | null; // Added prop
}

const PERSON_DISPLAY_CARD_WIDTH_PX = 240; 
const CHILDREN_GAP_PX = 32; 

const PersonDisplayCard: React.FC<{
  person: Person;
  currentYear: number;
  isSelected: boolean;
  onClick: () => void;
  isRoyalSpouse?: boolean;
}> = ({ person, currentYear, isSelected, onClick, isRoyalSpouse }) => {
  const age = calculateAge(person.birthYear, currentYear);
  const excommunicatedFilter = person.isExcommunicated ? 'filter-grayscale' : '';

  let baseBgColor = 'bg-stone-50';
  let baseBorderClasses = 'border border-stone-400';
  let baseTextColor = 'text-slate-700';
  let hoverBgColor = 'hover:bg-stone-100';
  let titleSpecificNote = '';

  if (person.title === 'King' || person.title === 'Queen') {
    baseBgColor = 'bg-yellow-100';
    baseBorderClasses = 'border-2 border-yellow-500';
    baseTextColor = 'text-yellow-700';
    hoverBgColor = 'hover:bg-yellow-200';
  } else if (person.title === 'Prince' || person.title === 'Princess' || person.title === 'Prince Consort') {
    baseBgColor = 'bg-sky-100';
    baseBorderClasses = 'border-2 border-sky-500';
    baseTextColor = 'text-sky-700';
    hoverBgColor = 'hover:bg-sky-200';
  } else if (person.title === 'Duke' || person.title === 'Duchess' || person.title === 'Duke Consort') {
    baseBgColor = 'bg-emerald-100';
    baseBorderClasses = 'border-2 border-emerald-500';
    baseTextColor = 'text-emerald-700';
    hoverBgColor = 'hover:bg-emerald-200';
  } else if (person.isRoyalBlood) {
    baseBgColor = 'bg-teal-50';
    baseBorderClasses = 'border-2 border-teal-500';
    baseTextColor = 'text-teal-700';
    hoverBgColor = 'hover:bg-teal-100';
  }

  if (isRoyalSpouse && person.isRoyalBlood) {
    titleSpecificNote = "Dynastic Marriage";
  }

  let selectionClasses = '';
  if (isSelected) {
    selectionClasses = 'ring-4 ring-offset-2 ring-pink-500 shadow-2xl scale-105';
  }

  const statusOpacity = !person.isAlive || person.isExcommunicated ? 'opacity-60' : '';
  const cardClasses = `p-2 rounded-md shadow-lg hover:shadow-xl transition-all w-60 cursor-pointer relative ${statusOpacity} ${baseBgColor} ${baseBorderClasses} ${hoverBgColor} ${selectionClasses}`;

  return (
    <div className={cardClasses} onClick={onClick} style={{ minHeight: '56px' }} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()} aria-label={`Select ${person.firstName} ${person.lastName}`} aria-pressed={isSelected}>
      <div className="flex items-center space-x-2">
        <img
          src={person.portraitUrl}
          alt={person.firstName}
          className={`w-10 h-10 rounded-full border ${excommunicatedFilter} ${baseBorderClasses.includes('border-2') ? 'border-current' : 'border-stone-300'}`}
        />
        <div>
          <p className={`font-semibold ${baseTextColor} flex items-center text-sm`}>
            {person.title ? `${person.title} ` : ''}{person.firstName} {person.lastName}
            {person.gender === Gender.Male ? <SimpleMaleIcon className="ml-1 text-blue-500 w-4 h-4" title="Male"/> : <SimpleFemaleIcon className="ml-1 text-pink-500 w-4 h-4" title="Female"/>}
            {!person.isAlive && <SkullIcon className="ml-1 text-red-600 w-4 h-4" title="Deceased"/>}
            {person.isExcommunicated && <ExcommunicationIcon className="ml-1 text-gray-600 w-4 h-4" title="Excommunicated"/>}
            {person.isMarriedToRoyal && !person.isRoyalBlood && !person.isExcommunicated && <LinkIcon className="ml-1 text-emerald-500 w-4 h-4" title="Married into Royalty"/>}
          </p>
          <p className="text-xs text-slate-500 font-sans">
            {person.isAlive ? `Age: ${age}` : `Died: ${person.deathYear} (Age ${calculateAge(person.birthYear, person.deathYear!)})`}
            {`, Sts: ${person.statusPoints}`}
          </p>
          {person.isExcommunicated && <p className="text-xs text-red-600 font-semibold font-sans">Excommunicated</p>}
        </div>
      </div>
      {titleSpecificNote && <div className={`text-xs ${baseTextColor} italic text-center pt-1 font-sans`}>{titleSpecificNote}</div>}
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
  dynastyFounderId, // Use prop
}) => {
  const person = allPeople[personId];
  if (!person) {
    return null;
  }

  const playerDynastyLastName = dynastyFounderId && allPeople[dynastyFounderId] ? allPeople[dynastyFounderId].lastName : null;

  const currentSpouseOfPerson = person.spouseId ? allPeople[person.spouseId] : null;
  const childrenToDisplay: Person[] = [];
  let hasSharedChildrenWithCurrentSpouseThatAreDeferred = false;

  for (const childId of person.childrenIds) {
    const child = allPeople[childId];
    if (!child || !playerDynastyLastName) continue;

    const father = child.fatherId ? allPeople[child.fatherId] : null;
    const mother = child.motherId ? allPeople[child.motherId] : null;
    let displayThisChild = true;

    if (father && mother && father.isRoyalBlood && mother.isRoyalBlood) {
        // Both parents are royal.
        const fatherIsPlayerDynasty = father.lastName === playerDynastyLastName && !father.isForeignRoyal;
        const motherIsPlayerDynasty = mother.lastName === playerDynastyLastName && !mother.isForeignRoyal;

        if (fatherIsPlayerDynasty && motherIsPlayerDynasty) {
            // Case 1: Both parents are from the player's dynasty (e.g., cousins).
            // Defer to the parent with the smaller ID to avoid duplicate rendering.
            const displayingParentId = father.id < mother.id ? father.id : mother.id;
            if (person.id !== displayingParentId) {
                displayThisChild = false;
            }
        } else if ((fatherIsPlayerDynasty && mother.isForeignRoyal) || (motherIsPlayerDynasty && father.isForeignRoyal)) {
            // Case 2: One parent is player's dynasty, the other is a foreign royal.
            // Children should always be displayed under the player's dynasty parent.
            // `person` is the current node. If `person` is the player's dynasty parent of this child, `displayThisChild` remains true.
            const playerDynastyParentInCouple = fatherIsPlayerDynasty ? father : mother;
            if (person.id !== playerDynastyParentInCouple.id) {
                // This means `person` is the foreign royal spouse, or some other relation.
                // Children are shown with player's dynasty parent, so if `person` is not that parent, don't display here.
                // This specific branch logic might be redundant if tree traversal ensures `person` is always player's lineage.
                // The critical part is ensuring `displayThisChild` is `true` if `person` IS the player's dynasty parent.
                // Defaulting to true and only setting to false in specific deferral cases handles this.
                 displayThisChild = false; // Should only happen if person IS the foreign royal, which is not normal tree traversal
            } else {
                displayThisChild = true; // Explicitly show if `person` is the player dynasty parent
            }
        }
        // Other cases (e.g. two foreign royals marrying) are not part of player's tree display logic.
    }
    // If one parent is royal (player's) and other is commoner (not isRoyalBlood),
    // the `if (father && mother && father.isRoyalBlood && mother.isRoyalBlood)` condition is false.
    // So `displayThisChild` remains `true` by default, and child displays under the royal parent (`person`). This is correct.


    if (displayThisChild) {
      childrenToDisplay.push(child);
    } else {
      // Logic for 'hasSharedChildrenWithCurrentSpouseThatAreDeferred'
      // This child is being deferred to be displayed under the other parent.
      // If that other parent is the currentSpouseOfPerson, then set the flag.
      const otherBioParent = person.id === father?.id ? mother : father;
      if (currentSpouseOfPerson && otherBioParent && currentSpouseOfPerson.id === otherBioParent.id) {
          hasSharedChildrenWithCurrentSpouseThatAreDeferred = true;
      }
    }
  }


  const numChildrenToDisplay = childrenToDisplay.length;
  
  // This message should primarily appear for intra-dynastic marriages where children are deferred
  // or if, for some other reason, a child with the current spouse is not in childrenToDisplay.
  const shouldThisNodeDeferToCurrentSpouse = 
      person.isRoyalBlood && 
      currentSpouseOfPerson && 
      currentSpouseOfPerson.isRoyalBlood && 
      person.id > currentSpouseOfPerson.id;


  // const relations: LocalArcherRelation[] = childrenToDisplay.map(child => ({ // Relations not used if ArcherElement is removed
  //   targetId: child.id,
  //   targetAnchor: 'top',
  //   sourceAnchor: 'bottom',
  // }));

  return (
    // <ArcherElement id={person.id} relations={relations}> // Temporarily removed
      <div className="inline-flex flex-col items-center"> 
        <div className="flex items-center justify-center space-x-1 p-1 rounded-md mb-4"> 
          <PersonDisplayCard
            person={person}
            currentYear={currentYear}
            isSelected={selectedPersonDetailId === person.id}
            onClick={() => onSelectPerson(person.id)}
            isRoyalSpouse={false}
          />
          {currentSpouseOfPerson && (
            <>
              <HeartIcon className="text-red-500 w-4 h-4 mx-1 shrink-0" title="Married"/>
              <PersonDisplayCard
                person={currentSpouseOfPerson}
                currentYear={currentYear}
                isSelected={selectedPersonDetailId === currentSpouseOfPerson.id}
                onClick={() => onSelectPerson(currentSpouseOfPerson.id)}
                isRoyalSpouse={currentSpouseOfPerson.isRoyalBlood}
              />
            </>
          )}
        </div>

        {numChildrenToDisplay > 0 && (
          <div className={`flex flex-row justify-center items-start gap-${CHILDREN_GAP_PX / 4} pt-4`}> 
            {childrenToDisplay.map((child) => (
              <FamilyMemberNode
                key={child.id}
                personId={child.id}
                allPeople={allPeople}
                currentYear={currentYear}
                onSelectPerson={onSelectPerson}
                selectedPersonDetailId={selectedPersonDetailId}
                level={level + 1}
                dynastyFounderId={dynastyFounderId} // Pass down
              />
            ))}
          </div>
        )}
        
        {/* Show message if this person is supposed to defer to their spouse for displaying children,
            AND there are shared children with that spouse that are indeed being deferred,
            AND no children ended up in childrenToDisplay (meaning all shared children were deferred). */}
        {shouldThisNodeDeferToCurrentSpouse && hasSharedChildrenWithCurrentSpouseThatAreDeferred && numChildrenToDisplay === 0 && (
           <div className="text-xs text-slate-500 italic mt-2 p-1 bg-stone-100 rounded font-sans shadow-sm">
             Dynastic Child(ren) Shown Elsewhere (with {currentSpouseOfPerson?.firstName}).
           </div>
        )}
      </div>
    // </ArcherElement> // Temporarily removed
  );
};
