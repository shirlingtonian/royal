
import React, { useState, useCallback, useEffect } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { useGameActions } from '../../contexts/GameActionsContext';

import { FamilyTreeView } from '../tree/FamilyTreeView';
import { PotentialSuitorsPanel } from '../panels/PotentialSuitorsPanel';
import { MarriageModal } from '../modals/MarriageModal';
import { ControlsPanel } from './ControlsPanel';
import { RivalDynastiesPanel } from '../panels/RivalDynastiesPanel';
import { DynastyUpgradesPanel } from '../panels/DynastyUpgradesPanel';
import { PersonDetailModal } from '../modals/PersonDetailModal';
import { DataPage } from '../modals/DataPage';
import { RivalDynastyDetailModal } from '../modals/RivalDynastyDetailModal';
import { StatusLedgerModal } from '../modals/StatusLedgerModal'; // Added

const ZOOM_LEVELS = [0.25, 0.35, 0.5, 0.75, 1.0, 1.25, 1.5];

export const AppLayout: React.FC = () => {
  const { gameState, isLoading, effectiveStatus } = useGameState();
  const {
    gameEngine,
    modalManager,
    playerActions, 
    dynastyActions, 
    rivalActions, 
    uiActions, 
  } = useGameActions();

  const [zoomLevel, setZoomLevel] = useState(1.0);
  const handleZoomIn = useCallback(() => setZoomLevel(prevZoom => ZOOM_LEVELS.indexOf(prevZoom) < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[ZOOM_LEVELS.indexOf(prevZoom) + 1] : prevZoom), []);
  const handleZoomOut = useCallback(() => setZoomLevel(prevZoom => ZOOM_LEVELS.indexOf(prevZoom) > 0 ? ZOOM_LEVELS[ZOOM_LEVELS.indexOf(prevZoom) - 1] : prevZoom), []);

  const [showDynastyUpgradesPanelUI, setShowDynastyUpgradesPanelUI] = useState(false);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (modalManager.isAnyModalOrPanelOpen()) {
          return;
        }

        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'BUTTON' || activeElement.hasAttribute('role') && (activeElement.getAttribute('role') === 'button' || activeElement.getAttribute('role') === 'checkbox'))) {
          return;
        }
        
        event.preventDefault();
        if (gameEngine.isPlaying) { // This covers both normal and fast-forward play
          gameEngine.pause();
        } else {
          if (gameState && gameState.dynastyFounderId) {
            gameEngine.play(); // Default to normal play when resuming from pause
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameEngine.isPlaying, gameEngine.play, gameEngine.pause, modalManager, gameState]);


  if (isLoading || !gameState) {
    return <div className="flex items-center justify-center min-h-screen text-2xl text-yellow-900">Loading Dynasty...</div>;
  }

  const selectedRoyalForModal = gameState.selectedRoyalIdForMarriage ? gameState.allPeople[gameState.selectedRoyalIdForMarriage] : null;
  const selectedPersonForDetailModal = gameState.selectedPersonDetailId ? gameState.allPeople[gameState.selectedPersonDetailId] : null;
  const selectedRivalDynastyForDetailModal = gameState.selectedRivalDynastyId ? gameState.rivalDynasties.find(r => r.id === gameState.selectedRivalDynastyId) : null;
  const isGameOver = !gameState.dynastyFounderId && gameState.currentYear > 0;

  return (
    <div className="min-h-screen flex flex-col text-slate-800 bg-stone-200">
      <header className="bg-yellow-900 p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-50 tracking-wider">Royal Dynasty Simulator</h1>
      </header>
      <div> 
        <ControlsPanel
          currentYear={gameState.currentYear}
          dynastyName={gameState.dynastyName}
          statusBreakdown={effectiveStatus}
          dynastyTreasury={gameState.dynastyTreasury}
          onPlay={gameEngine.play}
          onPause={gameEngine.pause}
          onFastForward={gameEngine.fastForward} // Changed
          isPlaying={gameEngine.isPlaying}
          isFastForwarding={gameEngine.isFastForwarding} // Added
          isGameOver={isGameOver}
          notifications={gameState.notifications}
          onToggleStatusLedger={uiActions.toggleStatusLedgerModal}
        />
      </div>
      <main className="flex-grow p-4 grid grid-cols-1 md:grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)] gap-4 h-[calc(100vh_-_theme(spacing.40)_-_theme(spacing.8))]">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden custom-scrollbar h-full">
          <FamilyTreeView
            dynastyFounderId={gameState.dynastyFounderId}
            displayRootId={gameState.currentMonarchId} // Added displayRootId
            allPeople={gameState.allPeople}
            currentYear={gameState.currentYear}
            dynastyName={gameState.dynastyName}
            onSelectPerson={uiActions.selectPersonDetail} 
            selectedPersonDetailId={gameState.selectedPersonDetailId}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            canZoomIn={zoomLevel < ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            canZoomOut={zoomLevel > ZOOM_LEVELS[0]}
          />
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar h-full pb-4">
          <button onClick={uiActions.toggleRivalDynastiesPanel} className="p-2 bg-yellow-50 text-yellow-800 border-2 border-yellow-700 hover:bg-yellow-100 rounded transition-colors w-full font-sans font-semibold sticky top-0 z-10 shadow-sm" aria-expanded={modalManager.showRivalDynastiesPanel} aria-controls="rival-leaderboard-panel">{modalManager.showRivalDynastiesPanel ? 'Hide' : 'Show'} Royal Leaderboard</button>
          {modalManager.showRivalDynastiesPanel && (
            <div id="rival-leaderboard-panel" className="bg-white rounded-lg shadow-xl overflow-y-auto p-1 custom-scrollbar min-h-[200px]">
              <RivalDynastiesPanel
                playerDynastyName={gameState.dynastyName}
                playerDynastyStatus={effectiveStatus.totalEffectiveStatus}
                rivalDynasties={gameState.rivalDynasties}
                onSelectRival={uiActions.openRivalDetailModal} 
                playerAlliances={gameState.alliances}
              />
            </div>
          )}

          <button onClick={() => setShowDynastyUpgradesPanelUI(!showDynastyUpgradesPanelUI)} className="p-2 bg-yellow-50 text-yellow-800 border-2 border-yellow-700 hover:bg-yellow-100 rounded transition-colors w-full font-sans font-semibold sticky top-[calc(theme(spacing.12)+theme(spacing.2))] z-10 shadow-sm" aria-expanded={showDynastyUpgradesPanelUI} aria-controls="dynasty-upgrades-panel">{showDynastyUpgradesPanelUI ? 'Hide' : 'Show'} Dynasty Enhancements</button>
          {showDynastyUpgradesPanelUI && (
            <div id="dynasty-upgrades-panel" className="bg-white rounded-lg shadow-xl overflow-y-auto custom-scrollbar p-1 min-h-[200px]">
              <DynastyUpgradesPanel
                availableItems={gameState.availableItems}
                ownedItemsCount={gameState.ownedItemsCount}
                dynastyTreasury={gameState.dynastyTreasury}
                onPurchaseItem={dynastyActions.purchaseItemAction} 
              />
            </div>
          )}

          <button onClick={uiActions.toggleDataPage} className="p-2 bg-yellow-50 text-yellow-800 border-2 border-yellow-700 hover:bg-yellow-100 rounded transition-colors w-full font-sans font-semibold sticky top-[calc(theme(spacing.24)+theme(spacing.4))] z-10 shadow-sm" aria-expanded={modalManager.isDataPageOpen} aria-controls="dynasty-data-page">{modalManager.isDataPageOpen ? 'Close' : 'View'} Dynasty Archives</button>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden custom-scrollbar flex-grow min-h-[300px]">
            <PotentialSuitorsPanel
              suitors={gameState.potentialSuitors}
              currentYear={gameState.currentYear}
              selectedRoyalIdForMarriage={gameState.selectedRoyalIdForMarriage}
              onSelectSuitorForMarriage={(suitorId) => {
                if (gameState.selectedRoyalIdForMarriage) {
                  playerActions.confirmMarriage(gameState.selectedRoyalIdForMarriage, suitorId); 
                }
              }}
            />
          </div>
        </div>
      </main>

      {selectedRoyalForModal && (
        <MarriageModal
          isOpen={modalManager.isMarriageModalOpen}
          onClose={uiActions.closeMarriageModal} 
          royalPerson={selectedRoyalForModal}
          suitors={gameState.potentialSuitors}
          relatedRoyalSuitors={gameState.relatedRoyalSuitorsForModal}
          currentYear={gameState.currentYear}
          onConfirmMarriage={playerActions.confirmMarriage} 
          dynastyName={gameState.dynastyName}
        />
      )}
      {selectedPersonForDetailModal && (
        <PersonDetailModal
          isOpen={modalManager.isPersonDetailModalOpen}
          onClose={uiActions.closePersonDetailModal} 
          person={selectedPersonForDetailModal}
          currentYear={gameState.currentYear}
          dynastyFounderId={gameState.dynastyFounderId}
          onInitiateMarriage={playerActions.selectPersonForMarriage} 
          onTryForChild={playerActions.tryForChildAction} 
          onExcommunicate={playerActions.excommunicateMemberAction} 
          onRemovePersonFromTree={playerActions.removePersonFromTreeAction} 
          allPeople={gameState.allPeople}
        />
      )}
      {modalManager.isDataPageOpen && (
        <DataPage
          isOpen={modalManager.isDataPageOpen}
          onClose={uiActions.toggleDataPage} 
          historicalStatus={gameState.historicalStatus}
          historicalTreasury={gameState.historicalTreasury}
          allPeople={gameState.allPeople}
          dynastyName={gameState.dynastyName}
        />
      )}
      {selectedRivalDynastyForDetailModal && (
        <RivalDynastyDetailModal
          isOpen={modalManager.isRivalDetailModalOpen}
          onClose={uiActions.closeRivalDetailModal} 
          rivalDynasty={selectedRivalDynastyForDetailModal}
          currentYear={gameState.currentYear}
          onAttemptDiplomaticAlliance={rivalActions.attemptDiplomaticAllianceAction} 
          playerAlliances={gameState.alliances}
          diplomaticAttempts={gameState.diplomaticAttempts}
        />
      )}
      {modalManager.isStatusLedgerOpen && ( 
        <StatusLedgerModal
          isOpen={modalManager.isStatusLedgerOpen}
          onClose={uiActions.toggleStatusLedgerModal}
          allPeople={gameState.allPeople}
          currentYear={gameState.currentYear}
          dynastyName={gameState.dynastyName}
          dynastyFounderId={gameState.dynastyFounderId}
          onExcommunicate={playerActions.excommunicateMemberAction}
        />
      )}
      <footer className="text-center p-2 text-xs text-yellow-100 bg-yellow-900">
        Current Year: <span className="font-sans">{gameState.currentYear}</span>. {gameState.dynastyName}.
        Total Status: <span className="font-sans">{effectiveStatus.totalEffectiveStatus.toFixed(2)}</span>.
        Treasury: <span className="font-sans">{gameState.dynastyTreasury} gold</span>.
      </footer>
    </div>
  );
};
