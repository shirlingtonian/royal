import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types/index';
import { advanceYear as advanceYearService } from '../services/core/game-loop.service';
import { AUTO_ADVANCE_INTERVAL_MS, FAST_FORWARD_INTERVAL_MS } from '../../constants';

export interface GameEngineControls {
  isPlaying: boolean;
  isFastForwarding: boolean;
  play: () => void;
  pause: () => void;
  fastForward: () => void;
  advanceYearTick: () => void;
}

export const useGameEngine = (
  currentGameStateRef: React.MutableRefObject<GameState | null>,
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>
): GameEngineControls => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [autoAdvanceIntervalId, setAutoAdvanceIntervalId] = useState<number | null>(null);
  const [fastForwardIntervalId, setFastForwardIntervalId] = useState<number | null>(null);

  const advanceYearTick = useCallback(() => {
    const gameState = currentGameStateRef.current;
    if (!gameState || (!gameState.dynastyFounderId && gameState.currentYear > 0)) {
      // This should be caught by the useEffect calling pause, but added for safety.
      return;
    }
    setGameState(prevState => {
      if (!prevState) return null;
      if (!prevState.dynastyFounderId && prevState.currentYear > 0) return prevState;
      return advanceYearService(prevState);
    });
  }, [setGameState, currentGameStateRef]);


  const pause = useCallback(() => {
    if (autoAdvanceIntervalId) {
      clearInterval(autoAdvanceIntervalId);
      setAutoAdvanceIntervalId(null);
    }
    if (fastForwardIntervalId) {
      clearInterval(fastForwardIntervalId);
      setFastForwardIntervalId(null);
    }
    setIsPlaying(false);
    setIsFastForwarding(false);
  }, [autoAdvanceIntervalId, fastForwardIntervalId]);

  const play = useCallback(() => {
    const gameState = currentGameStateRef.current;
    if ((isPlaying && !isFastForwarding) || (gameState && !gameState.dynastyFounderId && gameState.currentYear > 0)) {
      return; 
    }
    pause(); 
    
    setIsPlaying(true);
    setIsFastForwarding(false); 
    const intervalId = setInterval(advanceYearTick, AUTO_ADVANCE_INTERVAL_MS);
    setAutoAdvanceIntervalId(intervalId);
  }, [isPlaying, isFastForwarding, currentGameStateRef, advanceYearTick, pause]);

  const fastForward = useCallback(() => {
    const gameState = currentGameStateRef.current;
    if ((isPlaying && isFastForwarding) || (gameState && !gameState.dynastyFounderId && gameState.currentYear > 0)) {
      return; 
    }
    pause();

    setIsPlaying(true); 
    setIsFastForwarding(true); 
    const intervalId = setInterval(advanceYearTick, FAST_FORWARD_INTERVAL_MS);
    setFastForwardIntervalId(intervalId);
  }, [isPlaying, isFastForwarding, currentGameStateRef, advanceYearTick, pause]);

  useEffect(() => {
    return () => {
      if (autoAdvanceIntervalId) {
        clearInterval(autoAdvanceIntervalId);
      }
      if (fastForwardIntervalId) {
        clearInterval(fastForwardIntervalId);
      }
    };
  }, [autoAdvanceIntervalId, fastForwardIntervalId]);

  useEffect(() => {
    const gameState = currentGameStateRef.current;
    if (gameState && !gameState.dynastyFounderId && gameState.currentYear > 0) {
      if (isPlaying || isFastForwarding) {
        pause();
      }
    }
  }, [currentGameStateRef.current?.dynastyFounderId, currentGameStateRef.current?.currentYear, isPlaying, isFastForwarding, pause]);


  return {
    isPlaying,
    isFastForwarding,
    play,
    pause,
    fastForward,
    advanceYearTick,
  };
};