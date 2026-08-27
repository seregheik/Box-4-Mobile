import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  let { role } = useLocalSearchParams<{ role: "agent" | "buyer" }>();

  // Fallback in case of development reloads where params are lost
  if (!role) {
    role = "buyer";
  }

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toastRef = useRef<ToastRef>(null);

  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    termsAccepted;

  const handleRegister = async () => {
    if (!isFormValid) return; // Fallback in case it's somehow pressed

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await AuthService.register({
        role,
        full_name: fullName,
        email,
        password,
      });
      // Navigate to verify OTP
      router.replace({
        pathname: "/(auth)/verify-otp",
        params: { email },
      });
    } catch (error: any) {
      if (error?.response?.status === 400 && error?.response?.data) {
        const data = error.response.data;
        if (data.email && Array.isArray(data.email) && data.email.length > 0) {
          setErrorMessage(data.email[0]);
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          const firstError = data[firstKey];
          if (Array.isArray(firstError) && firstError.length > 0) {
            setErrorMessage(firstError[0]);
          } else if (typeof firstError === "string") {
            setErrorMessage(firstError);
          } else {
            setErrorMessage("Registration failed. Please check your details.");
          }
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
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
              Create your{" "}
              <ThemedText style={styles.titleHighlight}>account</ThemedText>
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Create a new account
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
                name="person-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#A0A0A0"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

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
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formOptionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <Ionicons
                  name={termsAccepted ? "checkbox" : "square-outline"}
                  size={20}
                  color={termsAccepted ? Colors.light.tintRed : "#777"}
                  style={styles.checkboxIcon}
                />
                <ThemedText style={styles.termsText}>
                  I agree to the Terms of service
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: Colors.light.tintRed },
              (!isFormValid || isLoading) && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.registerButtonText}>
                Register
              </ThemedText>
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
    color: "#E52020", // Red color matching the screenshot
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
  termsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3c87f7",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIcon: {
    marginRight: Spacing.one,
  },
  eyeIcon: {
    padding: Spacing.one,
  },
  registerButton: {
    width: "100%",
    height: 56,
    borderRadius: Spacing.two,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60, // Push it down
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
