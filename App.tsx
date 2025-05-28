
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Person } from './types';
import { startNewGame, advanceYear, marryPeople, calculateAge, tryForChild, excommunicateMember } from './services/gameService';
import { FamilyTreeView } from './components/FamilyTreeView';
import { PotentialSuitorsPanel } from './components/PotentialSuitorsPanel';
import { MarriageModal } from './components/MarriageModal';
import { ControlsPanel } from './components/ControlsPanel';
import { SelectedPersonDetailPanel } from './components/SelectedPersonDetailPanel';
import { MIN_MARRIAGE_AGE } from './constants';


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setGameState(startNewGame());
    setIsLoading(false);
  }, []);

  const handleAdvanceYear = useCallback(() => {
    if (!gameState || !gameState.dynastyFounderId) return; 
    setGameState(prevState => advanceYear(prevState!));
  }, [gameState]);

  const handleSelectPersonForMarriage = useCallback((royalId: string) => {
    setGameState(prevState => {
      if (!prevState) return null;
      const royal = prevState.allPeople[royalId];
      if (royal && royal.isAlive && !royal.spouseId && !royal.isExcommunicated && calculateAge(royal.birthYear, prevState.currentYear) >= MIN_MARRIAGE_AGE) {
        return { ...prevState, selectedRoyalIdForMarriage: royalId, isMarriageModalOpen: true };
      }
      return prevState; 
    });
  }, []);
  
  const handleConfirmMarriage = useCallback((royalId: string, suitorId: string) => {
    setGameState(prevState => {
      if (!prevState) return null;
      return marryPeople(prevState, royalId, suitorId);
    });
  }, []);

  const handleCloseMarriageModal = useCallback(() => {
    setGameState(prevState => prevState ? { ...prevState, isMarriageModalOpen: false, selectedRoyalIdForMarriage: null } : null);
  }, []);

  const handleSelectPersonDetail = useCallback((personId: string | null) => {
    setGameState(prevState => prevState ? { ...prevState, selectedPersonDetailId: personId } : null);
  }, []);

  const handleTryForChild = useCallback((motherId: string) => {
    setGameState(prevState => {
      if (!prevState) return null;
      return tryForChild(prevState, motherId);
    });
  }, []);

  const handleExcommunicateMember = useCallback((personId: string) => {
     setGameState(prevState => {
      if (!prevState) return null;
      return excommunicateMember(prevState, personId);
    });
  }, []);


  if (isLoading || !gameState) {
    return <div className="flex items-center justify-center min-h-screen text-2xl text-purple-300">Loading Dynasty...</div>;
  }

  const selectedRoyalForModal = gameState.selectedRoyalIdForMarriage ? gameState.allPeople[gameState.selectedRoyalIdForMarriage] : null;
  const selectedPersonForDetailPanel = gameState.selectedPersonDetailId ? gameState.allPeople[gameState.selectedPersonDetailId] : null;
  
  const livingRoyalBloodMembers = Object.values(gameState.allPeople).filter(p => p.isAlive && p.isRoyalBlood && !p.isExcommunicated);
  const dynastyStatus = livingRoyalBloodMembers.length > 0 
    ? livingRoyalBloodMembers.reduce((sum, p) => sum + p.statusPoints, 0) / livingRoyalBloodMembers.length
    : 0;
  
  const isGameOver = !gameState.dynastyFounderId;


  return (
    <div className="min-h-screen flex flex-col text-slate-100 bg-[#3A3153]"> {/* Main background */}
      <header className="bg-[#2C2541] p-4 shadow-lg"> {/* Darker purple header */}
        <h1 className="text-3xl font-bold text-center text-amber-300 tracking-wider">
          Royal Dynasty Simulator
        </h1>
      </header>

      <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 max-h-[calc(100vh-100px)]">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
           <ControlsPanel
            currentYear={gameState.currentYear}
            dynastyName={gameState.dynastyName}
            dynastyStatus={dynastyStatus}
            onAdvanceYear={handleAdvanceYear}
            isGameOver={isGameOver}
            notifications={gameState.notifications}
          />
          <div className="flex-grow min-h-[300px]">
             <SelectedPersonDetailPanel
                person={selectedPersonForDetailPanel}
                currentYear={gameState.currentYear}
                dynastyFounderId={gameState.dynastyFounderId}
                onInitiateMarriage={handleSelectPersonForMarriage}
                onTryForChild={handleTryForChild}
                onExcommunicate={handleExcommunicateMember}
                allPeople={gameState.allPeople}
            />
          </div>
        </div>

        <div className="lg:col-span-1 bg-[#4A3F6A] rounded-lg shadow-xl overflow-y-auto custom-scrollbar"> {/* Panel background */}
          <FamilyTreeView
            dynastyFounderId={gameState.dynastyFounderId}
            allPeople={gameState.allPeople}
            currentYear={gameState.currentYear}
            dynastyName={gameState.dynastyName}
            onSelectPerson={handleSelectPersonDetail}
            selectedPersonDetailId={gameState.selectedPersonDetailId}
          />
        </div>

        <div className="lg:col-span-1 bg-[#4A3F6A] rounded-lg shadow-xl overflow-y-auto custom-scrollbar"> {/* Panel background */}
           <PotentialSuitorsPanel
            suitors={gameState.potentialSuitors}
            currentYear={gameState.currentYear}
            selectedRoyalIdForMarriage={gameState.selectedRoyalIdForMarriage}
            onSelectSuitorForMarriage={(suitorId) => {
                if (gameState.selectedRoyalIdForMarriage) {
                    handleConfirmMarriage(gameState.selectedRoyalIdForMarriage, suitorId);
                }
            }}
          />
        </div>
      </main>
      
      {selectedRoyalForModal && (
        <MarriageModal
          isOpen={gameState.isMarriageModalOpen}
          onClose={handleCloseMarriageModal}
          royalPerson={selectedRoyalForModal}
          suitors={gameState.potentialSuitors}
          currentYear={gameState.currentYear}
          onConfirmMarriage={handleConfirmMarriage}
          dynastyName={gameState.dynastyName}
        />
      )}
      <footer className="text-center p-2 text-xs text-purple-400 bg-[#2C2541]"> {/* Darker purple footer */}
        Current Year: {gameState.currentYear}. {gameState.dynastyName}.
      </footer>
    </div>
  );
};

export default App;
