
import React from 'react';
import { GameStateProvider } from './GameStateContext';
import { GameActionsProvider } from './GameActionsContext';

// This component now acts as a convenient wrapper for all game-related providers.
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GameStateProvider>
      <GameActionsProvider>
        {children}
      </GameActionsProvider>
    </GameStateProvider>
  );
};

// The single useGame hook is now deprecated in favor of useGameState and useGameActions.
// Components should import and use these more specific hooks.
// For example:
// import { useGameState } from './GameStateContext';
// import { useGameActions } from './GameActionsContext';
//
// const MyComponent = () => {
//   const { gameState, isLoading } = useGameState();
//   const { playGame, openModal } = useGameActions();
//   // ...
// }
