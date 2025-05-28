import React from 'react';
import { Person } from '../types';
import { FamilyMemberNode } from './FamilyMemberNode';

interface FamilyTreeViewProps {
  dynastyFounderId: string | null;
  allPeople: Record<string, Person>;
  currentYear: number;
  dynastyName: string;
  onSelectPerson: (personId: string | null) => void;
  selectedPersonDetailId: string | null;
}

export const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  dynastyFounderId,
  allPeople,
  currentYear,
  dynastyName,
  onSelectPerson,
  selectedPersonDetailId,
}) => {
  if (!dynastyFounderId || !allPeople[dynastyFounderId]) {
    return (
      <div className="p-4 text-center text-purple-300">
        The dynasty has not been founded or has ended.
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto h-full bg-[#4A3F6A] rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-amber-300 mb-6 sticky top-0 bg-[#4A3F6A] py-2 z-10">
        The {dynastyName}
      </h2>
      <FamilyMemberNode
        personId={dynastyFounderId}
        allPeople={allPeople}
        currentYear={currentYear}
        onSelectPerson={onSelectPerson}
        selectedPersonDetailId={selectedPersonDetailId}
        level={0}
        isRoot={true}
      />
    </div>
  );
};