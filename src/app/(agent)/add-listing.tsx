import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/back-button";
import { Spacing, Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { useAddListingStore } from "@/store/add-listing.store";
import { Step1BasicInfo } from "@/components/add-listing/Step1BasicInfo";
import { Step2Location } from "@/components/add-listing/Step2Location";
import { Step3Photos } from "@/components/add-listing/Step3Photos";

export default function AddListingScreen() {
  const insets = useSafeAreaInsets();
  const currentStep = useAddListingStore(state => state.currentStep);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1BasicInfo />;
      case 2: return <Step2Location />;
      case 3: return <Step3Photos />;
      default: return <Step1BasicInfo />;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BackButton />
          <ThemedText style={styles.title}>Add Listing</ThemedText>
          {/* Placeholder to center title */}
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  backgroundColor: theme.tintBlue, 
                  width: `${(currentStep / 3) * 100}%` 
                }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>Step {currentStep} of 3</ThemedText>
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.light.buttonGrey,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.one,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
});
