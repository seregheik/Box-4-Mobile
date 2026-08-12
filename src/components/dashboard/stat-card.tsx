import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export function StatCard({ title, value, icon, color = "#0495CC" }: StatCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: 16,
    minWidth: 160,
    marginRight: Spacing.three,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.three,
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 13,
    marginTop: 2,
  },
});
