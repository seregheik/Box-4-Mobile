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
        <Ionicons name="location-sharp" size={14} color="#1E293B" />
        <ThemedText style={styles.locationText}>Lugbe, Abuja</ThemedText>
        <Ionicons name="chevron-down" size={14} color="#1E293B" />
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
    backgroundColor: "#ffffff",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E293B",
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
    borderColor: "#34A8DB",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C00000",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
