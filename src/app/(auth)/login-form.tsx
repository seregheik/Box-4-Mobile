import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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
import { Colors, Spacing } from "@/constants/theme";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toastRef = useRef<ToastRef>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await AuthService.login({
        role: "buyer", // Defaulting to buyer since role is required
        email,
        password,
      });

      setAuth(response);

      if (response.role === "agent") {
        router.replace("/(agent)");
      } else {
        router.replace("/(user)");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error?.response?.status === 400 && error?.response?.data) {
        const data = error.response.data;
        if (data.detail) {
          setErrorMessage(data.detail);
        } else if (data.non_field_errors && data.non_field_errors.length > 0) {
          setErrorMessage(data.non_field_errors[0]);
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
      } else if (error?.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Toast ref={toastRef} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <BackButton />

          {/* Header */}
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title}>
              Let&apos;s{" "}
              <ThemedText style={styles.titleHighlight}>Sign In</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign into your account
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {errorMessage ? (
              <ThemedText style={styles.errorText}>
                {errorMessage.toUpperCase()}
              </ThemedText>
            ) : null}

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formOptionsRow}>
              <TouchableOpacity>
                <ThemedText style={styles.forgotPasswordText}>
                  Forgot password?
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <ThemedText style={styles.showPasswordText}>
                  {showPassword ? "Hide password" : "Show password"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: Colors.light.tintRed },
              (!isFormValid || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            )}
          </TouchableOpacity>
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
    color: "#555",
    marginTop: Spacing.one,
    fontWeight: "500",
  },
  errorText: {
    color: Colors.light.tintRed,
    fontSize: 14,
    marginBottom: Spacing.one,
    fontWeight: "500",
  },
  formContainer: {
    gap: Spacing.three,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 56,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  formOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.one,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  showPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: Spacing.two,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
