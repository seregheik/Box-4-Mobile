import { Colors, Spacing } from "@/constants/theme";
import React from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";

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
  ...rest
}: ThemedModalProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...rest}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView 
          intensity={30} 
          tint={colorScheme === "dark" ? "dark" : "light"} 
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.background },
              ]}
            >
              {title && (
                <ThemedText style={styles.modalTitle}>{title}</ThemedText>
              )}

              {children}

              {showCancelButton && (
                <ThemedButton
                  title={cancelText}
                  variant="secondary"
                  style={styles.cancelButton}
                  onPress={onClose}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // slightly lighter since blur adds darkening/lightening
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.four,
    maxHeight: "80%",
    paddingBottom: 70,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Spacing.three,
  },
  cancelButton: {
    marginTop: Spacing.three,
  },
});
