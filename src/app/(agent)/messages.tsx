import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  avatarUrl: string;
  isOnline?: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "King Jeoffery",
    message: "When do you want to inspect the property",
    time: "10.45",
    unreadCount: 1,
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    isOnline: true,
  },
  {
    id: "2",
    name: "Samuel Ella",
    message: "Lorem ipsum dolor sit amet",
    time: "11.00",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    name: "Emmet Perry",
    message: "Excepteur sint occaecat cupidatat non",
    time: "12.50",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "4",
    name: "Walter Lindsey",
    message: "Quis nostrud exercitation ullamco",
    time: "1 Day ago",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "5",
    name: "Velma Cole",
    message: "Excepteur sint occaecat cupidatat non",
    time: "2 Days ago",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
  },
];

const ChatItem = ({ item }: { item: Chat }) => {
  const renderRightActions = () => {
    return (
      <View style={styles.deleteAction}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} containerStyle={styles.swipeableContainer}>
      <View style={styles.chatCard}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineBadge} />}
        </View>
        <View style={styles.chatDetails}>
          <ThemedText style={styles.chatName}>{item.name}</ThemedText>
          <ThemedText style={styles.chatMessage} numberOfLines={1}>
            {item.message}
          </ThemedText>
        </View>
        <View style={styles.chatMeta}>
          <ThemedText style={styles.chatTime}>{item.time}</ThemedText>
          {item.unreadCount ? (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadText}>{item.unreadCount}</ThemedText>
            </View>
          ) : (
            <View style={styles.badgeSpacer} />
          )}
        </View>
      </View>
    </Swipeable>
  );
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <BackButton />
          <ThemeSwitcher />
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity style={styles.segmentButton}>
            <ThemedText style={styles.segmentTextInactive}>
              Notification
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, styles.segmentButtonActive]}
          >
            <ThemedText style={styles.segmentTextActive}>Messages</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.title}>All chats</ThemedText>

        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F6F8",
    borderRadius: 30,
    marginHorizontal: Spacing.four,
    padding: 4,
    marginBottom: Spacing.six,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 26,
  },
  segmentButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentTextInactive: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A2A2B5",
  },
  segmentTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E1E2D",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E2D",
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  swipeableContainer: {
    borderRadius: Spacing.two,
    backgroundColor: "#E52020",
    overflow: "hidden",
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  avatarContainer: {
    position: "relative",
    marginRight: Spacing.three,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  onlineBadge: {
    position: "absolute",
    top: 2,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7BC043",
    borderWidth: 2,
    borderColor: "#F5F6F8",
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E1E2D",
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: "#777",
  },
  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 40,
  },
  chatTime: {
    fontSize: 12,
    color: "#A2A2B5",
  },
  unreadBadge: {
    backgroundColor: "#7BC043",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeSpacer: {
    height: 20,
    marginTop: 4,
  },
  deleteAction: {
    backgroundColor: "#E52020",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
});
