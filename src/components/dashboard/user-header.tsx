import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function UserHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Location Picker */}
      <TouchableOpacity style={styles.locationBadge}>
        <Ionicons name="location-sharp" size={14} color="#64748B" />
        <ThemedText style={styles.locationText}>Benin City, Edo</ThemedText>
        <Ionicons name="chevron-down" size={14} color="#64748B" />
      </TouchableOpacity>

      {/* Right Side Actions */}
      <View style={styles.rightActions}>
        <ThemeSwitcher />
        
        {/* Notification Bell */}
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={20} color="#1E293B" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        {/* User Avatar */}
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=11" }}
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
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  notificationBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D60202",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
