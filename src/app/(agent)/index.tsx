import { useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { AgentHeader } from "@/components/dashboard/agent-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { Property, PropertyCard } from "@/components/dashboard/property-card";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "4Bedroom apartment",
    address: "No 2 Ikorodu street, lagos",
    location: "Ikorodu, Lagos",
    price: "10,00000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
  },
  {
    id: "2",
    title: "3Bedroom bungalow",
    address: "45 Adeola Odeku, Victoria Island",
    location: "Victoria Island, Lagos",
    price: "8,50000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
];

const RECENT_MESSAGES = [
  { id: "1", name: "King Jeoffery", message: "When do you want to inspect...", time: "10:45 AM", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: "2", name: "Samuel Ella", message: "Is the property still available?", time: "Yesterday", avatar: "https://i.pravatar.cc/150?img=12" },
];

export default function AgentHomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        <AgentHeader />

        {/* Overview Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.horizontalList, { marginTop: Spacing.four }]}
        >
          <StatCard title="Active Listings" value="12" icon="home" color={Colors.light.tintBlue} />
          <StatCard title="Total Views" value="1.2k" icon="eye" color="#7BC043" />
          <StatCard title="Leads" value="45" icon="people" color={Colors.light.tintRed} />
        </ScrollView>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsRow}>
          <QuickAction title="Add Listing" icon="add-circle" color={Colors.light.tintBlue} onPress={() => {}} />
          <QuickAction title="Messages" icon="chatbubble-ellipses" color={Colors.light.tintBlue} onPress={() => router.push("/(agent)/messages")} />
          <QuickAction title="Calendar" icon="calendar" color={Colors.light.tintBlue} onPress={() => {}} />
          <QuickAction title="Analytics" icon="bar-chart" color={Colors.light.tintBlue} onPress={() => {}} />
        </View>

        {/* Recent Inquiries */}
        <SectionHeader title="Recent Inquiries" actionText="View all" onAction={() => router.push("/(agent)/messages")} />
        <View style={styles.inquiriesContainer}>
          {RECENT_MESSAGES.map((msg) => (
            <TouchableOpacity key={msg.id} style={[styles.messageCard, { backgroundColor: theme.backgroundElement }]} onPress={() => router.push("/(agent)/messages")}>
              <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
              <View style={styles.messageDetails}>
                <ThemedText style={styles.messageName}>{msg.name}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.messagePreview} numberOfLines={1}>{msg.message}</ThemedText>
              </View>
              <ThemedText themeColor="textSecondary" style={styles.messageTime}>{msg.time}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Active Listings */}
        <SectionHeader title="My Active Listings" actionText="Manage" onAction={() => router.push("/(agent)/listings")} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {MOCK_PROPERTIES.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </ScrollView>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -Spacing.three,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
  },
  horizontalList: {
    // paddingRight: Spacing.four,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.two,
  },
  inquiriesContainer: {
    gap: Spacing.two,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: 16,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.three,
  },
  messageDetails: {
    flex: 1,
  },
  messageName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  messagePreview: {
    fontSize: 12,
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
  }
});
