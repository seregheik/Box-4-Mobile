import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SearchBar } from '@/components/dashboard/search-bar';
import { CategoryChips } from '@/components/dashboard/category-chips';
import { PropertyCard, Property } from '@/components/dashboard/property-card';
import { UserService, NearestProperty } from '@/services/user.service';

const CATEGORIES = ["All", "Apartments", "Houses", "Hotels"];

export default function PropertiesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const mapProperty = (p: NearestProperty): Property => ({
    id: p.id,
    title: p.title,
    rating: 4.8,
    reviewsCount: p.views_count || 0,
    location: p.address,
    price: Number(p.price).toLocaleString(),
    priceUnit: "/ month",
    image: p.cover_photo,
    badge: p.category,
    isSaved: false,
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.total_rooms || 0,
  });

  const fetchProperties = async (pageNum: number, search: string, category: string) => {
    try {
      setIsLoading(true);
      // Map category back to api expected values
      let categoryParam = undefined;
      if (category === "Apartments") categoryParam = "apartment";
      if (category === "Houses") categoryParam = "house";
      if (category === "Hotels") categoryParam = "hotel";
      
      const searchParam = search.trim() === "" ? undefined : search;
      
      const response = await UserService.getProperties({
        page: pageNum,
        page_size: 10,
        category: categoryParam,
        search: searchParam,
      });

      const mappedProperties = response.results.map(mapProperty);

      if (pageNum === 1) {
        setProperties(mappedProperties);
      } else {
        setProperties(prev => [...prev, ...mappedProperties]);
      }
      
      setTotalCount(response.count);
      setHasMore(response.next !== null);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    fetchProperties(1, searchQuery, activeCategory);
  }, [activeCategory]);

  const handleSearch = () => {
    setPage(1);
    fetchProperties(1, searchQuery, activeCategory);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProperties(nextPage, searchQuery, activeCategory);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <CategoryChips
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <ThemedText style={styles.resultsText}>
        Found <ThemedText style={{fontWeight: 'bold'}}>{totalCount}</ThemedText> results
      </ThemedText>
    </View>
  );

  const renderFooter = () => {
    if (isLoading && page > 1) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={theme.tintRed} />
        </View>
      );
    }
    
    if (hasMore) {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <ThemedText style={styles.loadMoreText}>Load More</ThemedText>
          <Ionicons name="refresh" size={16} color="#1E293B" style={{marginLeft: 4}} />
        </TouchableOpacity>
      );
    }
    
    return <View style={{ height: Spacing.six }} />;
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <ThemedText style={styles.pageTitle}>All Properties</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>
      
      {isLoading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.tintRed} />
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} fullWidth />}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.six }]}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  headerContent: {
    marginBottom: Spacing.four,
  },
  resultsText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
  },
  loaderContainer: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
});
