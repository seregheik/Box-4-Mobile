import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { CategoryChips } from "@/components/dashboard/category-chips";
import { CircleItem } from "@/components/dashboard/circle-item";
import { Features } from "@/components/dashboard/features";
import { Property, PropertyCard } from "@/components/dashboard/property-card";
import { SearchBar } from "@/components/dashboard/search-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { UserHeader } from "@/components/dashboard/user-header";
import { DashboardResponse, UserService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";

const CATEGORIES = ["All", "Luxury", "Residential", "Commercial"];

export default function UserHomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  const { full_name } = useAuthStore();
  const firstName = full_name?.split(" ")[0] || "User";

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, []),
  );

  const fetchDashboard = async () => {
    try {
      if (!dashboardData && !refreshing) setIsLoading(true);
      const data = await UserService.getBuyerDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  }, []);

  if (isLoading && !dashboardData) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.tintRed} />
      </ThemedView>
    );
  }

  // Fallback to empty if no data
  const nearestProperties = dashboardData?.nearest_properties || [];

  const featuredListings: Property[] = nearestProperties
    .filter((p) => p.is_featured || p.is_boosted)
    .map((p) => ({
      id: p.id,
      title: p.title,
      rating: 4.8,
      reviewsCount: p.views_count || 0,
      location: p.address,
      price: Number(p.price).toLocaleString(),
      priceUnit: "/ month",
      image: p.cover_photo,
      badge: p.category,
      isFavorite: false,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      size: p.total_rooms || 0,
    }));

  const allProperties: Property[] = nearestProperties.map((p) => ({
    id: p.id,
    title: p.title,
    rating: 4.8,
    reviewsCount: p.views_count || 0,
    location: p.address,
    price: Number(p.price).toLocaleString(),
    priceUnit: "/ month",
    image: p.cover_photo,
    badge: p.category,
    isFavorite: false,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.total_rooms || 0,
  }));

  const topLocations = dashboardData?.top_locations || [];
  const topAgents = dashboardData?.top_agents || [];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.tintRed}
            colors={[theme.tintRed]}
          />
        }
      >
        <UserHeader />

        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>
            Hey, <ThemedText style={styles.nameText}>{firstName}!</ThemedText>
          </ThemedText>
          <ThemedText style={styles.subGreetingText}>
            Let's start exploring
          </ThemedText>
        </View>

        <SearchBar />

        <CategoryChips
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <>
            <SectionHeader title="Featured Listings" actionText="view all" />
            <View style={styles.horizontalList}>
              <Features listings={featuredListings} />
            </View>
          </>
        )}

        {/* Properties */}
        {allProperties.length > 0 && (
          <>
            <SectionHeader title="All Properties" actionText="view all" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.horizontalList, { marginTop: Spacing.four }]}
            >
              {allProperties.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </ScrollView>
          </>
        )}

        {/* Top Locations */}
        {topLocations.length > 0 && (
          <>
            <SectionHeader title="Top Locations" actionText="Explore" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            >
              {topLocations.map((item, index) => (
                <CircleItem
                  key={index.toString()}
                  variant="horizontal"
                  name={item.location}
                  image={item.cover_photo}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Top Agents */}
        {topAgents.length > 0 && (
          <>
            <SectionHeader title="Top agents" actionText="Explore" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            >
              {topAgents.map((item) => (
                <CircleItem
                  key={item.id}
                  variant="vertical"
                  name={item.full_name}
                  image={item.profile_picture}
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    marginHorizontal: -Spacing.three,
    // backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
  },
  greetingSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  greetingText: {
    fontSize: 20,
    // color: "#1E293B",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D60202",
  },
  subGreetingText: {
    fontSize: 20,
    // color: "#1E293B",
  },
  horizontalList: {
    // marginHorizontal: Spacing.one,
    // paddingHorizontal: Spacing.four,
  },
});
