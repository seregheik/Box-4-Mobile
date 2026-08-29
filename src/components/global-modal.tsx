import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useModalStore } from "@/store/modal.store";

export function GlobalModal() {
  const { isVisible, content, title, showCancelButton, cancelText, onClose, hideModal } = useModalStore();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  
  const [isRendered, setIsRendered] = useState(false);
  const translateY = useRef(new Animated.Value(500)).current; // Start off-screen
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 300,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRendered(false);
      });
    }
  }, [isVisible]);

  if (!isRendered) return null;

  const handleClose = () => {
    if (onClose) onClose();
    hideModal();
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999, opacity }]}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <BlurView
          intensity={30}
          tint={colorScheme === "dark" ? "dark" : "light"}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { 
                  backgroundColor: theme.background,
                  transform: [{ translateY }]
                },
              ]}
            >
              {title && (
                <ThemedText style={styles.modalTitle}>{title}</ThemedText>
              )}

              {content}

              {showCancelButton && (
                <ThemedButton
                  title={cancelText || "Cancel"}
                  variant="secondary"
                  style={styles.cancelButton}
                  onPress={handleClose}
                />
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
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
