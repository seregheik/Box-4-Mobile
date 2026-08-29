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

const initialState = {
  isVisible: false,
  content: null,
  title: undefined,
  cancelText: "Cancel",
  showCancelButton: true,
  onClose: undefined,
};

export const useModalStore = create<ModalState>((set) => ({
  ...initialState,
  showModal: (options) => set({ ...initialState, ...options, isVisible: true }),
  hideModal: () => set(initialState),
}));
