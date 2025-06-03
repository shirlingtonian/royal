
import { useCallback } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { marryPeople, tryForChild, getEligibleRelatedRoyalSuitors } from '../../services/player/relationship.service';
import { excommunicateMember, removePersonFromTree } from '../../services/player/governance.service';
import { calculateAge } from '../../services/entities/person.service';
import { MIN_MARRIAGE_AGE } from '../../constants';
import { ModalManagerState } from '../useModalManager';

export const usePlayerActions = (
    setGameState: ReturnType<typeof useGameState>['setGameState'],
    modalManager: ModalManagerState
) => {

    const selectPersonForMarriage = useCallback((royalId: string) => {
        setGameState(prevState => {
            if (!prevState) return null;
            const royal = prevState.allPeople[royalId];
            if (royal && royal.isAlive && !royal.spouseId && !royal.isExcommunicated && calculateAge(royal.birthYear, prevState.currentYear) >= MIN_MARRIAGE_AGE && royal.isRoyalBlood) {
                const relatedSuitors = getEligibleRelatedRoyalSuitors(royal, prevState.allPeople, prevState.currentYear);
                
                modalManager.closeModal('PersonDetail'); 
                modalManager.openModal('Marriage');

                return {
                    ...prevState,
                    selectedRoyalIdForMarriage: royalId,
                    relatedRoyalSuitorsForModal: relatedSuitors,
                    selectedPersonDetailId: null 
                };
            }
            const currentNotifications = prevState.notifications || [];
            let notificationMessage = "This person cannot be selected for marriage at this time.";
            if (royal && royal.spouseId) notificationMessage = `${royal.firstName} is already married.`;
            else if (royal && royal.isExcommunicated) notificationMessage = `${royal.firstName} is excommunicated and cannot marry.`;
            else if (royal && calculateAge(royal.birthYear, prevState.currentYear) < MIN_MARRIAGE_AGE) notificationMessage = `${royal.firstName} is too young to marry.`;
            else if (royal && !royal.isRoyalBlood) notificationMessage = `${royal.firstName} is not of royal blood and cannot be selected for dynastic marriage through this panel.`;
            
            return { ...prevState, notifications: [...currentNotifications, notificationMessage] };
        });
    }, [setGameState, modalManager]);

    const confirmMarriage = useCallback((royalId: string, suitorId: string) => {
        setGameState(prevState => {
            if (!prevState) return null;
            return marryPeople(prevState, royalId, suitorId);
        });
        modalManager.closeModal('Marriage');
        setGameState(prevState => prevState ? { ...prevState, selectedRoyalIdForMarriage: null, relatedRoyalSuitorsForModal: [] } : null);
    }, [setGameState, modalManager]);

    const tryForChildAction = useCallback((motherId: string) => {
        setGameState(prevState => prevState ? tryForChild(prevState, motherId) : null);
    }, [setGameState]);

    const excommunicateMemberAction = useCallback((personId: string) => {
        setGameState(prevState => prevState ? excommunicateMember(prevState, personId) : null);
    }, [setGameState]);
    
    const removePersonFromTreeAction = useCallback((personId: string) => {
        setGameState(prevState => {
            if (!prevState) return null;
            const isCurrentlySelected = prevState.selectedPersonDetailId === personId;
            const newState = removePersonFromTree(prevState, personId);
            if (isCurrentlySelected) {
                modalManager.closeModal('PersonDetail'); 
                return { ...newState, selectedPersonDetailId: null };
            }
            return newState;
        });
    }, [setGameState, modalManager]);

    return {
        selectPersonForMarriage,
        confirmMarriage,
        tryForChildAction,
        excommunicateMemberAction,
        removePersonFromTreeAction,
    };
};
