
import { useCallback } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { purchaseItem as purchaseItemService } from '../../services/systems/item.service';

export const useDynastyActions = (
    setGameState: ReturnType<typeof useGameState>['setGameState']
) => {
    const purchaseItemAction = useCallback((itemId: string) => {
        setGameState(prevState => prevState ? purchaseItemService(prevState, itemId) : null);
    }, [setGameState]);

    return {
        purchaseItemAction,
    };
};
