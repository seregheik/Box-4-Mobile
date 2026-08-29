import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import {
  AnimatedErrorIcon,
  AnimatedSuccessIcon,
} from "./animated-status-icons";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";

export interface StatusModalProps {
  status: "success" | "error";
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  closeText?: string;
  retryText?: string;
}

export function StatusModal({
  status,
  message,
  onClose,
  onRetry,
  closeText = "Close",
  retryText = "Retry",
}: StatusModalProps) {
  return (
    <View style={styles.container}>
      {status === "success" ? (
        <AnimatedSuccessIcon size={80} />
      ) : (
        <AnimatedErrorIcon size={80} />
      )}

      <ThemedText style={styles.messageText}>{message}</ThemedText>

      <View style={styles.buttonContainer}>
        {status === "error" && onRetry ? (
          <>
            <ThemedButton
              title={closeText}
              variant="outline"
              style={[styles.button, { marginRight: Spacing.two }]}
              onPress={onClose}
            />
            <ThemedButton
              title={retryText}
              variant="primary"
              style={styles.button}
              onPress={onRetry}
            />
          </>
        ) : (
          <ThemedButton
            title={closeText}
            variant="primary"
            style={styles.button}
            onPress={onClose}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.two,
    alignItems: "center",
    paddingBottom: 40, // Edit this bottom padding as needed for your device
  },
  messageText: {
    textAlign: "center",
    marginBottom: Spacing.five,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: Spacing.three,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 50,
  },
  button: {
    flex: 1,
  },
});
