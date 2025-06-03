
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Person } from '../../types/index';
import { FamilyMemberNode } from './FamilyMemberNode'; 
// import ArcherContainer from 'react-archer'; // Temporarily removed

interface FamilyTreeViewProps {
  dynastyFounderId: string | null; // Used as fallback and for FamilyMemberNode's internal logic
  displayRootId?: string | null; // Preferred root, e.g., currentMonarchId
  allPeople: Record<string, Person>;
  currentYear: number;
  dynastyName: string;
  onSelectPerson: (personId: string | null) => void; 
  selectedPersonDetailId: string | null;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

const MIN_TREE_CONTAINER_WIDTH = '6000px';
const MIN_TREE_CONTAINER_HEIGHT = '4000px';

export const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  dynastyFounderId,
  displayRootId,
  allPeople,
  currentYear,
  dynastyName,
  onSelectPerson, 
  selectedPersonDetailId,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
}) => {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
        const closestButton = e.target.closest('button');
        const closestPointer = e.target.closest('[style*="cursor: pointer"]'); 
         if (closestButton || (closestPointer && closestPointer !== e.currentTarget)) {
            return;
        }
    }
    if (treeContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - treeContainerRef.current.offsetLeft);
      setStartY(e.pageY - treeContainerRef.current.offsetTop);
      setScrollLeftStart(treeContainerRef.current.scrollLeft);
      setScrollTopStart(treeContainerRef.current.scrollTop);
      treeContainerRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !treeContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - treeContainerRef.current.offsetLeft;
    const y = e.pageY - treeContainerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; 
    const walkY = (y - startY) * 1.5;
    treeContainerRef.current.scrollLeft = scrollLeftStart - walkX;
    treeContainerRef.current.scrollTop = scrollTopStart - walkY;
  }, [isDragging, startX, startY, scrollLeftStart, scrollTopStart]);

  const stopDragging = useCallback(() => {
    if (treeContainerRef.current) {
      treeContainerRef.current.style.cursor = 'grab';
    }
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const currentRef = treeContainerRef.current;
    if (currentRef) {
        window.addEventListener('mouseup', stopDragging);
        currentRef.addEventListener('mouseleave', stopDragging); 

        return () => {
            window.removeEventListener('mouseup', stopDragging);
            if (currentRef) { 
                 currentRef.removeEventListener('mouseleave', stopDragging);
            }
        };
    }
    return () => {}; 
  }, [stopDragging]);

  // Determine the actual root for rendering
  // Prefer displayRootId if it's valid and exists, otherwise fallback to dynastyFounderId
  const mainContentIdToRender = (displayRootId && allPeople[displayRootId]) 
                                ? displayRootId 
                                : dynastyFounderId;

  if (!mainContentIdToRender) {
    return <div className="p-4 text-center text-slate-500">The dynasty has ended or no valid root found.</div>;
  }
  // Ensure the person actually exists for rendering
  if (!allPeople[mainContentIdToRender]) {
     return <div className="p-4 text-center text-slate-500">The dynasty has ended or the starting person is not found.</div>;
  }


  return (
    <div className="flex flex-col h-full bg-white text-slate-800 overflow-hidden">
      <div className="p-3 border-b border-stone-200 text-center bg-stone-50">
        <h2 className="text-xl font-semibold text-teal-700">
          The {dynastyName}
        </h2>
        <div className="flex justify-center items-center space-x-2 mt-2">
          <button
            onClick={onZoomOut}
            disabled={!canZoomOut}
            className="px-3 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white rounded font-bold text-lg font-sans"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="text-sm text-slate-600 font-sans w-16 text-center">Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
          <button
            onClick={onZoomIn}
            disabled={!canZoomIn}
            className="px-3 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white rounded font-bold text-lg font-sans"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={treeContainerRef}
        className="flex-grow overflow-auto cursor-grab custom-scrollbar text-center p-4" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* <ArcherContainer 
            strokeColor="#555" 
            strokeWidth={1.5} 
            offset={8} 
            lineStyle="curve"
            endMarker={false} 
        > */}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              padding: '20px', 
              display: 'inline-block', 
              transition: 'transform 0.2s ease-out',
              minWidth: MIN_TREE_CONTAINER_WIDTH,
              minHeight: MIN_TREE_CONTAINER_HEIGHT,
            }}
          >
            <FamilyMemberNode
              personId={mainContentIdToRender} // Use the determined root ID
              allPeople={allPeople}
              currentYear={currentYear}
              onSelectPerson={onSelectPerson} 
              selectedPersonDetailId={selectedPersonDetailId}
              level={0}
              dynastyFounderId={dynastyFounderId} // Pass original dynastyFounderId for internal logic in FamilyMemberNode
            />
          </div>
        {/* </ArcherContainer> */}
      </div>
    </div>
  );
};
