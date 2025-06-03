
import React from 'react';
import { Person, Gender } from '../../types/index';
import { PersonCard } from '../shared/PersonCard'; 
import { MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE } from '../../constants';
import { calculateAge } from '../../services/entities/person.service'; 

interface SelectedPersonDetailPanelProps {
  person: Person | null;
  currentYear: number;
  dynastyFounderId: string | null; 
  onInitiateMarriage: (royalId: string) => void;
  onTryForChild: (motherId: string) => void;
  onExcommunicate: (personId: string) => void;
  onRemovePersonFromTree: (personId: string) => void;
  allPeople: Record<string, Person>; 
  onClose?: () => void;
}

export const SelectedPersonDetailPanel: React.FC<SelectedPersonDetailPanelProps> = ({
  person,
  currentYear,
  dynastyFounderId,
  onInitiateMarriage,
  onTryForChild,
  onExcommunicate,
  onRemovePersonFromTree,
  allPeople,
  onClose
}) => {
  if (!person) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg h-full flex items-center justify-center">
        <p className="text-slate-500 font-sans">No person selected.</p>
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
                        allPeople[person.spouseId!]?.isAlive && 
                        !allPeople[person.spouseId!]?.isExcommunicated && 
                        age >= MIN_MARRIAGE_AGE &&
                        age <= MAX_CHILD_BEARING_AGE_FEMALE;

  const canBeExcommunicated = person.isAlive &&
                              !person.isExcommunicated &&
                              (person.id !== dynastyFounderId || Object.values(allPeople).filter(p => p.isRoyalBlood && p.isAlive && !p.isExcommunicated && p.id !== person.id && p.lastName === person.lastName).length > 0);
  
  const canBeRemovedFromTree = (!person.isAlive || person.isExcommunicated);

  const buttonBaseStyle = "w-full font-semibold py-2.5 px-5 rounded-md transition-colors shadow-sm border text-sm font-sans";
  const enabledButtonHoverFocus = "focus:outline-none focus:ring-2 focus:ring-offset-2";
  const disabledButtonClasses = "bg-slate-300 text-slate-500 cursor-not-allowed border-slate-300";

  return (
    <div className="p-1 overflow-y-auto custom-scrollbar h-full flex flex-col"> 
      <div className="flex-grow">
        <h3 id="person-detail-modal-title" className="text-xl font-semibold text-teal-700 mb-4 sticky top-0 bg-white py-3 z-10 border-b border-stone-200 px-4">
          Member Details
        </h3>
        <div className="px-4">
          <PersonCard
            person={person}
            currentYear={currentYear}
            isSelected={true} 
            className="mb-4"
          />
        
          <div className="space-y-1 text-sm text-slate-600 mb-4">
            <p><span className="font-semibold text-slate-700 font-sans">Born:</span> Year {person.birthYear} in {person.originCountry}</p>
            {person.fatherId && allPeople[person.fatherId] && <p><span className="font-semibold text-slate-700 font-sans">Father:</span> {allPeople[person.fatherId].firstName} {allPeople[person.fatherId].lastName}</p>}
            {person.motherId && allPeople[person.motherId] && <p><span className="font-semibold text-slate-700 font-sans">Mother:</span> {allPeople[person.motherId].firstName} {allPeople[person.motherId].lastName}</p>}
          </div>

          {spouse && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-1 font-sans">Spouse:</h4>
              <PersonCard person={spouse} currentYear={currentYear} />
            </div>
          )}

          {children.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-1 font-sans">Children:</h4>
              <div className="space-y-2">
                {children.map(child => (
                  child && <PersonCard key={child.id} person={child} currentYear={currentYear} />
                ))}
              </div>
            </div>
          )}
          
          <div className="my-6 p-4 bg-stone-100 rounded-lg border border-stone-200 shadow">
            <div className="space-y-3">
              {canMarry && (
                <button
                  onClick={() => {
                    onInitiateMarriage(person.id); 
                  }}
                  className={`${buttonBaseStyle} bg-teal-600 text-white border-teal-600 hover:bg-teal-700 focus:ring-teal-500 ${enabledButtonHoverFocus}`}
                >
                  Arrange Marriage for {person.firstName}
                </button>
              )}

              {canTryForKids && person.spouseId && allPeople[person.spouseId!] && (
                <button
                  onClick={() => onTryForChild(person.id)}
                  className={`${buttonBaseStyle} bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 ${enabledButtonHoverFocus}`}
                >
                  Try for Child with {allPeople[person.spouseId!]?.firstName}
                </button>
              )}

              {canBeExcommunicated && (
                <button
                  onClick={() => onExcommunicate(person.id)}
                  className={`${buttonBaseStyle} bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500 ${enabledButtonHoverFocus}`}
                >
                  Excommunicate {person.firstName}
                </button>
              )}

              {canBeRemovedFromTree ? (
                <button
                  onClick={() => {
                    onRemovePersonFromTree(person.id);
                  }}
                  className={`${buttonBaseStyle} bg-slate-500 text-white border-slate-500 hover:bg-slate-600 focus:ring-slate-400 ${enabledButtonHoverFocus}`}
                  title="Permanently remove this person from the family tree. This action is irreversible."
                >
                  Remove {person.firstName} from Tree
                </button>
              ) : person.isAlive && (
                  <button
                      disabled
                      className={`${buttonBaseStyle} ${disabledButtonClasses}`}
                      title="Person must be deceased or excommunicated to be removed."
                    >
                      Remove {person.firstName} from Tree
                    </button>
              )}
            </div>
          </div>

          {!person.isAlive && (
            <p className="text-center text-red-500 font-semibold p-2 bg-red-100 rounded my-4 font-sans">This person is deceased.</p>
          )}
          {person.isExcommunicated && (
            <p className="text-center text-gray-500 font-semibold p-2 bg-gray-100 rounded my-4 font-sans">This person is excommunicated.</p>
          )}
        </div>
      </div>
      
      {onClose && ( 
         <div className="px-4 pb-4 pt-2 sticky bottom-0 bg-white border-t border-stone-200 mt-auto">
            <button
                onClick={onClose}
                className={`${buttonBaseStyle} bg-slate-400 text-white border-slate-400 hover:bg-slate-500 focus:ring-slate-300 ${enabledButtonHoverFocus}`}
            >
            Close Details
            </button>
        </div>
      )}
    </div>
  );
};
