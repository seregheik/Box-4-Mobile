import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  note?: string;
  style?: any;
}

export function StatCard({
  title,
  value,
  icon,
  color = "#0495CC",
  note,
  style,
}: StatCardProps) {
  return (
    <ThemedView type="backgroundElement" style={[styles.card, style]}>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingRight: 32,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 28,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  noteText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
  },
});
