import React, { useEffect } from "react";
import { ModalProps } from "react-native";
import { useModalStore } from "@/store/modal.store";

export interface ThemedModalProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCancelButton?: boolean;
  cancelText?: string;
}

export function ThemedModal({
  visible,
  onClose,
  title,
  children,
  showCancelButton = true,
  cancelText = "Cancel",
}: ThemedModalProps) {
  const { showModal, hideModal } = useModalStore();

  useEffect(() => {
    if (visible) {
      showModal({
        content: children,
        title,
        onClose,
        showCancelButton,
        cancelText,
      });
    } else {
      hideModal();
    }
    
    // We only want to trigger this when visibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // We need to update the content if it changes while visible
  useEffect(() => {
    if (visible) {
      showModal({
        content: children,
        title,
        onClose,
        showCancelButton,
        cancelText,
      });
    }
  }, [children, title, showCancelButton, cancelText]);

  return null;
}
