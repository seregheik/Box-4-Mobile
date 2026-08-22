import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/back-button";
import { Spacing } from "@/constants/theme";

export default function AddListingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={styles.title}>Add Listing</ThemedText>
        <View style={{ width: 40 }} /> {/* Placeholder to center title */}
      </View>
      <View style={styles.content}>
        <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          Add listing form will be implemented here.
        </ThemedText>
      </View>
    </ThemedView>
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
  content: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: "center",
    alignItems: "center",
  },
});
