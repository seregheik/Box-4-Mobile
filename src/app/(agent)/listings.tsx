/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AgentPropertyCard } from "@/components/dashboard/agent-property-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Listing } from "@/services/agent.service";

const TABS = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
];

export default function ListingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch listings
  const fetchListings = async (pageNumber: number, shouldRefresh = false) => {
    try {
      if (pageNumber === 1 && !shouldRefresh) setIsLoading(true);

      const response = await AgentService.getMyListings({
        page: pageNumber,
        page_size: 10,
        type: activeTab,
        search: debouncedSearchQuery,
      });

      if (pageNumber === 1) {
        setListings(response.results);
      } else {
        setListings((prev) => [...prev, ...response.results]);
      }

      setHasMore(response.next !== null);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  };

  // React to filter/search changes
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await fetchListings(1);
    };
    init();
    return () => {
      mounted = false;
    };
  }, [activeTab, debouncedSearchQuery]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchListings(1, true);
  }, [activeTab, debouncedSearchQuery]);

  const loadMore = () => {
    if (!hasMore || isFetchingMore || isLoading) return;
    setIsFetchingMore(true);
    fetchListings(page + 1);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Listings</ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.tintBlue }]}
          onPress={() => router.push("/(agent)/add-listing")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search listings..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = activeTab === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive
                      ? theme.tintBlue
                      : theme.backgroundElement,
                  },
                ]}
                onPress={() => setActiveTab(item.id)}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    { color: isActive ? "#fff" : theme.textSecondary },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.tintBlue} />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => <AgentPropertyCard property={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="home-outline"
                size={48}
                color={theme.textSecondary}
              />
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                No listings found.
              </ThemedText>
            </View>
          }
          ListFooterComponent={
            isFetchingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.tintBlue} />
              </View>
            ) : null
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    height: 48,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.two,
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: Spacing.two,
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
});
