import { create } from 'zustand';
import React from 'react';

interface ModalState {
  isVisible: boolean;
  content: React.ReactNode | null;
  title?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  onClose?: () => void;
  showModal: (options: Omit<ModalState, 'isVisible' | 'showModal' | 'hideModal'>) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  content: null,
  title: undefined,
  cancelText: "Cancel",
  showCancelButton: true,
  onClose: undefined,
  showModal: (options) => set({ ...options, isVisible: true }),
  hideModal: () => set({ isVisible: false }),
}));
