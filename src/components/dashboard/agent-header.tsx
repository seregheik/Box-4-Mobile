import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemeSwitcher } from "@/components/theme-switcher";

export interface AgentHeaderProps {
  greeting?: string;
  agentName?: string;
  avatarUrl?: string;
}

export function AgentHeader({ greeting = "Hello,", agentName = "Agent!", avatarUrl = "https://i.pravatar.cc/150?img=47" }: AgentHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.greetingSection}>
        <ThemedText style={styles.greetingText}>
          {greeting} <ThemedText style={styles.nameText}>{agentName}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.subGreetingText}>
          Here's your overview today
        </ThemedText>
      </View>

      <View style={styles.rightActions}>
        <ThemeSwitcher />
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={20} color="#1E293B" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.two,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: 18,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0495CC", // Agent primary color
  },
  subGreetingText: {
    fontSize: 14,
    color: "#A2A2B5",
    marginTop: 2,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0495CC",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D60202", // Agent secondary color
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
