
import { useState, useCallback } from 'react';
import { ModalType } from '../types/index'; 

export interface ModalManagerState {
  isPersonDetailModalOpen: boolean;
  isMarriageModalOpen: boolean;
  isDataPageOpen: boolean;
  isRivalDetailModalOpen: boolean;
  isStatusLedgerOpen: boolean; // Added
  showRivalDynastiesPanel: boolean;
  wasPlayingBeforeUiInteraction: boolean;
  openModal: (modalType: ModalType) => void;
  closeModal: (modalType: ModalType) => void;
  closeAllModals: () => void;
  isAnyModalOrPanelOpen: (exclude?: ModalType) => boolean;
  setWasPlayingBeforeUiInteraction: (value: boolean) => void;
}

export const useModalManager = (): ModalManagerState => {
  const [isPersonDetailModalOpen, setIsPersonDetailModalOpen] = useState(false);
  const [isMarriageModalOpen, setIsMarriageModalOpen] = useState(false);
  const [isDataPageOpen, setIsDataPageOpen] = useState(false);
  const [isRivalDetailModalOpen, setIsRivalDetailModalOpen] = useState(false);
  const [isStatusLedgerOpen, setIsStatusLedgerOpen] = useState(false); // Added
  const [showRivalDynastiesPanel, setShowRivalDynastiesPanel] = useState(false);
  const [wasPlayingBeforeUiInteraction, setWasPlayingBeforeUiInteraction] = useState(false);

  const modalStates: Record<ModalType, boolean> = {
    PersonDetail: isPersonDetailModalOpen,
    Marriage: isMarriageModalOpen,
    DataPage: isDataPageOpen,
    RivalDetail: isRivalDetailModalOpen,
    StatusLedger: isStatusLedgerOpen, // Added
    RivalsPanel: showRivalDynastiesPanel,
  };

  const setModalState = (modalType: ModalType, isOpen: boolean) => {
    switch (modalType) {
      case 'PersonDetail': setIsPersonDetailModalOpen(isOpen); break;
      case 'Marriage': setIsMarriageModalOpen(isOpen); break;
      case 'DataPage': setIsDataPageOpen(isOpen); break;
      case 'RivalDetail': setIsRivalDetailModalOpen(isOpen); break;
      case 'StatusLedger': setIsStatusLedgerOpen(isOpen); break; // Added
      case 'RivalsPanel': setShowRivalDynastiesPanel(isOpen); break;
    }
  };

  const openModal = useCallback((modalType: ModalType) => {
    if (modalType === 'PoliticalPanel' as ModalType) return; 
    setModalState(modalType, true);
  }, []);

  const closeModal = useCallback((modalType: ModalType) => {
    if (modalType === 'PoliticalPanel' as ModalType) return;
    setModalState(modalType, false);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsPersonDetailModalOpen(false);
    setIsMarriageModalOpen(false);
    setIsDataPageOpen(false);
    setIsRivalDetailModalOpen(false);
    setIsStatusLedgerOpen(false); // Added
    setShowRivalDynastiesPanel(false);
  }, []);

  const isAnyModalOrPanelOpen = useCallback((exclude?: ModalType): boolean => {
    for (const type in modalStates) {
      if (type === exclude) continue;
      if (modalStates[type as ModalType]) return true;
    }
    return false;
  }, [
      isPersonDetailModalOpen, isMarriageModalOpen, isDataPageOpen, 
      isRivalDetailModalOpen, isStatusLedgerOpen, showRivalDynastiesPanel, 
    ]);

  return {
    isPersonDetailModalOpen,
    isMarriageModalOpen,
    isDataPageOpen,
    isRivalDetailModalOpen,
    isStatusLedgerOpen, // Added
    showRivalDynastiesPanel,
    wasPlayingBeforeUiInteraction,
    openModal,
    closeModal,
    closeAllModals,
    isAnyModalOrPanelOpen,
    setWasPlayingBeforeUiInteraction,
  };
};