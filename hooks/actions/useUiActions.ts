
import { useCallback } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import { ModalManagerState } from '../useModalManager';
import { ModalType } from '../../types/index'; 

export const useUiActions = (
    modalManager: ModalManagerState,
    setGameState: ReturnType<typeof useGameState>['setGameState'] 
) => {
    const closeMarriageModal = useCallback(() => {
        modalManager.closeModal('Marriage');
        setGameState(prevState => prevState ? { ...prevState, selectedRoyalIdForMarriage: null, relatedRoyalSuitorsForModal: [] } : null);
    }, [modalManager, setGameState]);

    const closePersonDetailModal = useCallback(() => {
        modalManager.closeModal('PersonDetail');
        setGameState(prevState => prevState ? { ...prevState, selectedPersonDetailId: null } : null);
    }, [modalManager, setGameState]);
    
    const toggleDataPage = useCallback(() => {
        modalManager.isDataPageOpen ? modalManager.closeModal('DataPage') : modalManager.openModal('DataPage');
    }, [modalManager]);

    const openRivalDetailModal = useCallback((rivalId: string) => {
        modalManager.openModal('RivalDetail');
        setGameState(prevState => prevState ? { ...prevState, selectedRivalDynastyId: rivalId } : null);
    }, [modalManager, setGameState]);

    const closeRivalDetailModal = useCallback(() => {
        modalManager.closeModal('RivalDetail');
        setGameState(prevState => prevState ? { ...prevState, selectedRivalDynastyId: null } : null);
    }, [modalManager, setGameState]);

    const toggleRivalDynastiesPanel = useCallback(() => {
        modalManager.showRivalDynastiesPanel ? modalManager.closeModal('RivalsPanel') : modalManager.openModal('RivalsPanel');
    }, [modalManager]);

    const selectPersonDetail = useCallback((personId: string | null) => {
        if (personId) {
            setGameState(prevState => prevState ? { ...prevState, selectedPersonDetailId: personId } : null);
            modalManager.openModal('PersonDetail');
        } else {
            // This case is handled by closePersonDetailModal
        }
    }, [setGameState, modalManager]);

    const toggleStatusLedgerModal = useCallback(() => {
        modalManager.isStatusLedgerOpen ? modalManager.closeModal('StatusLedger') : modalManager.openModal('StatusLedger');
    }, [modalManager]);


    return {
        closeMarriageModal,
        closePersonDetailModal,
        toggleDataPage,
        openRivalDetailModal,
        closeRivalDetailModal,
        toggleRivalDynastiesPanel,
        selectPersonDetail,
        toggleStatusLedgerModal, // Added
    };
};