
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { GameState, EffectiveStatusBreakdown } from '../types/index';
import { startNewGame as initializeGame } from '../services/core/game-initialization.service';
import { calculateEffectiveDynastyStatus } from '../services/player/dynasty.service';

interface GameStateContextType {
  gameState: GameState | null;
  gameStateRef: React.MutableRefObject<GameState | null>;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  isLoading: boolean;
  effectiveStatus: EffectiveStatusBreakdown;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const gameStateRef = useRef(gameState);
  const [isLoading, setIsLoading] = useState(true);
  const [effectiveStatus, setEffectiveStatus] = useState<EffectiveStatusBreakdown>({
    baseRoyalStatus: 0, itemStatusBoost: 0, totalEffectiveStatus: 0,
  });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const newGame = initializeGame();
    setGameState(newGame);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (gameState) {
      setEffectiveStatus(calculateEffectiveDynastyStatus(
        gameState.allPeople,
        gameState.ownedItemsCount,
        gameState.availableItems
      ));
    }
    // gameState.politicalEnvironment was not in this dependency array, so no change needed for its removal from gameState.
  }, [gameState?.allPeople, gameState?.ownedItemsCount, gameState?.availableItems, gameState?.currentMonarchId, gameState?.alliances]);

  return (
    <GameStateContext.Provider value={{ gameState, gameStateRef, setGameState, isLoading, effectiveStatus }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
