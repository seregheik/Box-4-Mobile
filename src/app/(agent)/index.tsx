import { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing, Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { AgentHeader } from "@/components/dashboard/agent-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { AgentProperty, AgentPropertyCard } from "@/components/dashboard/agent-property-card";
import { AgentService, AgentDashboardResponse } from "@/services/agent.service";


export default function AgentHomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  
  const [isListingsExpanded, setIsListingsExpanded] = useState(true);
  const [dashboardData, setDashboardData] = useState<AgentDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await AgentService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await fetchDashboard();
    };
    init();
    return () => { mounted = false; };
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboardData) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.tintBlue} />
      </ThemedView>
    );
  }

  const agentName = dashboardData?.agent?.full_name || "Agent";
  // The backend returns "Hey, Osasere Ikp!". We try to extract "Hey," to match the UI design.
  let greetingText = "Hello,";
  if (dashboardData?.greeting) {
    const parts = dashboardData.greeting.split(agentName);
    if (parts.length > 0 && parts[0].trim().length > 0) {
      greetingText = parts[0].trim();
    }
  }

  const activeListingsCount = dashboardData?.metrics?.active_listings?.count?.toString() || "0";
  const viewsCount = dashboardData?.metrics?.views?.total_views?.toString() || "0";
  const inquiriesCount = dashboardData?.metrics?.new_inquiries?.count?.toString() || "0";
  const activeListings = dashboardData?.active_listings || [];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <AgentHeader 
          greeting={greetingText}
          agentName={agentName}
          avatarUrl={dashboardData?.agent?.profile_picture}
        />

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <StatCard 
            title="Active Listings" 
            value={activeListingsCount} 
            icon="home" 
            color={Colors.light.tintBlue} 
            note={dashboardData?.metrics?.active_listings?.note} 
            style={styles.statCard}
          />
          <StatCard 
            title="Total Views" 
            value={viewsCount} 
            icon="eye" 
            color="#7BC043" 
            note={`Trend: ${dashboardData?.metrics?.views?.trend || "0"}`} 
            style={styles.statCard}
          />
          <StatCard 
            title="Leads" 
            value={inquiriesCount} 
            icon="people" 
            color={Colors.light.tintRed} 
            note={dashboardData?.metrics?.new_inquiries?.note} 
            style={styles.statCard}
          />
          <StatCard 
            title={`Plan: ${dashboardData?.metrics?.subscription?.plan_name || "Free"}`}
            value={dashboardData?.metrics?.subscription?.days_left?.toString() || "0"} 
            icon="card" 
            color="#9C27B0" 
            note={dashboardData?.metrics?.subscription?.days_left_text || "0 Days left"} 
            style={styles.statCard}
          />
        </View>

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
          <ThemedText themeColor="textSecondary" style={{ textAlign: "center", marginTop: Spacing.two, marginBottom: Spacing.four }}>
            You have no recent inquiries.
          </ThemedText>
        </View>

        {/* My Active Listings Dropdown */}
        <View style={styles.dropdownHeaderContainer}>
          <TouchableOpacity 
            style={styles.dropdownHeaderTouch} 
            onPress={() => setIsListingsExpanded(!isListingsExpanded)}
          >
            <ThemedText style={styles.dropdownTitle}>My Active Listings</ThemedText>
            <Ionicons 
              name={isListingsExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={theme.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push("/(agent)/listings")}>
            <ThemedText style={[styles.actionText, { color: theme.tintBlue }]}>View all</ThemedText>
          </TouchableOpacity>
        </View>
        
        {isListingsExpanded && (
          <View style={styles.listingsContainer}>
            {activeListings.length > 0 ? (
              activeListings.map((item: any) => (
                <AgentPropertyCard key={item.id} property={item} />
              ))
            ) : (
              <ThemedText themeColor="textSecondary" style={{ textAlign: "center", marginTop: Spacing.four }}>
                You have no active listings.
              </ThemedText>
            )}
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -Spacing.three,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: Spacing.four,
  },
  statCard: {
    width: "48%",
    marginBottom: Spacing.three,
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
  },
  dropdownHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  dropdownHeaderTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listingsContainer: {
    marginTop: Spacing.two,
  }
});
