
import React, { createContext, useContext, useEffect } from 'react';
// import { ModalType } from '../types'; // Not directly used here anymore for specific modal types
import { useGameState } from './GameStateContext';

import { useGameEngine, GameEngineControls } from '../hooks/useGameEngine';
import { useModalManager, ModalManagerState } from '../hooks/useModalManager';

import { usePlayerActions } from '../hooks/actions/usePlayerActions';
import { useDynastyActions } from '../hooks/actions/useDynastyActions';
// import { usePoliticalActions } from '../hooks/actions/usePoliticalActions'; // Removed
import { useRivalActions } from '../hooks/actions/useRivalActions';
import { useUiActions } from '../hooks/actions/useUiActions';

export interface GameActionsContextType { 
  gameEngine: GameEngineControls;
  modalManager: ModalManagerState;
  
  playerActions: ReturnType<typeof usePlayerActions>;
  dynastyActions: ReturnType<typeof useDynastyActions>;
  // politicalActions: ReturnType<typeof usePoliticalActions>; // Removed
  rivalActions: ReturnType<typeof useRivalActions>;
  uiActions: ReturnType<typeof useUiActions>;
}

const GameActionsContext = createContext<GameActionsContextType | undefined>(undefined);

export const GameActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gameStateRef, setGameState } = useGameState(); 
  
  const gameEngine = useGameEngine(gameStateRef, setGameState);
  const modalManager = useModalManager();

  const playerActions = usePlayerActions(setGameState, modalManager);
  const dynastyActions = useDynastyActions(setGameState);
  // const politicalActions = usePoliticalActions(setGameState); // Removed
  const rivalActions = useRivalActions(setGameState);
  const uiActions = useUiActions(modalManager, setGameState);


  useEffect(() => {
    // Use the generic isAnyModalOrPanelOpen to decide on pausing
    const anyPausableModalOrPanelOpen = modalManager.isAnyModalOrPanelOpen();

    if (anyPausableModalOrPanelOpen) {
        if (gameEngine.isPlaying && !modalManager.wasPlayingBeforeUiInteraction) {
            gameEngine.pause();
            modalManager.setWasPlayingBeforeUiInteraction(true);
        }
    } else {
        if (modalManager.wasPlayingBeforeUiInteraction) {
            // Only play if game is not over
            if (gameStateRef.current && gameStateRef.current.dynastyFounderId) {
              gameEngine.play();
            }
            modalManager.setWasPlayingBeforeUiInteraction(false);
        }
    }
  }, [
    // Depend on the generic check and wasPlayingBeforeUiInteraction
    modalManager.isAnyModalOrPanelOpen, 
    modalManager.wasPlayingBeforeUiInteraction, 
    gameEngine, 
    modalManager.setWasPlayingBeforeUiInteraction,
    gameStateRef // Added gameStateRef for checking game over state
  ]);
  
  const contextValue: GameActionsContextType = {
    gameEngine,
    modalManager,
    playerActions,
    dynastyActions,
    // politicalActions, // Removed
    rivalActions,
    uiActions,
  };

  return <GameActionsContext.Provider value={contextValue}>{children}</GameActionsContext.Provider>;
};

export const useGameActions = (): GameActionsContextType => {
  const context = useContext(GameActionsContext);
  if (context === undefined) {
    throw new Error('useGameActions must be used within a GameActionsProvider');
  }
  return context;
};