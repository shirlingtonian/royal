
import { useCallback } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { attemptDiplomaticAlliance as attemptDiplomaticAllianceService } from '../../services/diplomacy/alliance.service';

export const useRivalActions = (
    setGameState: ReturnType<typeof useGameState>['setGameState']
) => {
    const attemptDiplomaticAllianceAction = useCallback((rivalDynastyId: string) => {
        setGameState(prevState => prevState ? attemptDiplomaticAllianceService(prevState, rivalDynastyId) : null);
    }, [setGameState]);

    return {
        attemptDiplomaticAllianceAction,
    };
};
