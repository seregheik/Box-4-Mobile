import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Toast, ToastRef } from "@/components/toast";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { AuthService } from "@/services/auth.service";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuth(); // If we want to simulate login right after verify, though we might not have role here.

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(180);
  const [resentMessage, setResentMessage] = useState("");
  const toastRef = useRef<ToastRef>(null);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string) => {
    // Allow only numbers, max 4 digits
    const formattedText = text.replace(/[^0-9]/g, "").slice(0, 4);
    setOtp(formattedText);

    // Check if fully entered
    if (formattedText.length === 4) {
      verifyCode(formattedText);
    }
  };

  const verifyCode = async (otpCode: string) => {
    if (!email) {
      toastRef.current?.show("Missing email information.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.verifyOtp({
        email,
        otp_code: otpCode,
      });

      // Successfully verified. We can redirect to login, or simulate login if token is returned.
      // For now, redirect to login
      toastRef.current?.show(
        "Account verified successfully! Please log in.",
        "success",
      );
      setTimeout(() => {
        router.replace("/(auth)/login-form");
      }, 1000); // Wait for toast to animate
    } catch (error) {
      console.error("OTP Verification failed:", error);
      toastRef.current?.show("Invalid OTP code. Please try again.", "error");
      setOtp("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    if (!email) {
      toastRef.current?.show("Missing email information.", "error");
      return;
    }

    try {
      await AuthService.resendOtp({ email });
      setResentMessage("New OTP sent!");
      setTimeout(() => {
        setResentMessage("");
      }, 3000);
      setTimer(120);
      setOtp("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toastRef.current?.show(
        "Failed to resend OTP. Please try again.",
        "error",
      );
    }
  };

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `0${minutes}.${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Toast ref={toastRef} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <BackButton />

          {/* Header */}
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title}>
              Enter the{" "}
              <ThemedText style={styles.titleHighlight}>code</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter the 4 digit code that we just sent to{"\n"}
              <ThemedText style={styles.emailText}>
                {email || "your email"}
              </ThemedText>
            </ThemedText>
          </View>

          <ThemedText
            style={[
              styles.resentMessageText,
              { opacity: resentMessage ? 1 : 0 },
            ]}
          >
            {resentMessage || " "}
          </ThemedText>

          {/* OTP Input container */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => {
              const digit = otp[index] || "";
              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                    isLoading && styles.otpBoxDisabled,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.otpText,
                      digit ? styles.otpTextFilled : null,
                    ]}
                  >
                    {digit}
                  </ThemedText>
                </View>
              );
            })}

            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="numeric"
              maxLength={4}
              editable={!isLoading}
              style={styles.hiddenInput}
              autoFocus
            />
          </View>

          {isLoading && (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              color="#E52020"
              size="large"
            />
          )}

          <View style={styles.spacer} />

          {/* Timer */}
          <View style={styles.timerWrapper}>
            <View style={styles.timerContainer}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#333"
                style={styles.timerIcon}
              />
              <ThemedText style={styles.timerText}>
                {formatTimer(timer)}
              </ThemedText>
            </View>
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <ThemedText style={styles.resendText}>
              Didn&apos;t receive the OTP?{" "}
            </ThemedText>
            <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
              <ThemedText
                style={[
                  styles.resendAction,
                  timer > 0 && styles.resendActionDisabled,
                ]}
              >
                Resend OTP
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  headerContainer: {
    marginTop: Spacing.six,
    marginBottom: Spacing.six,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E1E2D",
  },
  titleHighlight: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E52020",
  },
  subtitle: {
    fontSize: 14,
    color: "#7A7A9D",
    marginTop: Spacing.two,
    lineHeight: 20,
  },
  emailText: {
    fontSize: 14,
    color: "#1E1E2D",
    fontWeight: "bold",
  },
  resentMessageText: {
    color: "#E52020",
    textAlign: "center",
    fontSize: 14,
    marginTop: Spacing.two,
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: Spacing.four,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F5F6F8",
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    borderColor: "#E52020",
    backgroundColor: "#FFF2F2",
  },
  otpBoxDisabled: {
    opacity: 0.7,
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E2D",
  },
  otpTextFilled: {
    color: "#E52020",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  spacer: {
    flex: 1,
  },
  timerWrapper: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerIcon: {
    marginRight: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#7A7A9D",
  },
  resendAction: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E52020",
  },
  resendActionDisabled: {
    color: "#A0A0A0",
  },
});
