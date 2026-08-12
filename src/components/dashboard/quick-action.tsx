import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

interface QuickActionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress?: () => void;
}

export function QuickAction({ title, icon, color = "#0495CC", onPress }: QuickActionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.iconWrapper}>
        <Ionicons name={icon} size={28} color={color} />
      </ThemedView>
      <ThemedText style={styles.title} numberOfLines={2}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
    marginRight: Spacing.three,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 12,
    textAlign: "center",
  },
});
