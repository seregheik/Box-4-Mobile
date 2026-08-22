import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  note?: string;
}

export function StatCard({
  title,
  value,
  icon,
  color = "#0495CC",
  note,
}: StatCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.textContainer}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </ThemedText>
        {note ? (
          <ThemedText style={styles.noteText} numberOfLines={1}>
            {note}
          </ThemedText>
        ) : null}
      </View>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingVertical: 20,
    borderRadius: 20,
    minWidth: 170,
    marginRight: Spacing.three,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingRight: 32,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 28,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
});
