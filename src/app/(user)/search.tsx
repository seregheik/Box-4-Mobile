import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { UserService } from '@/services/user.service';
import { Property, PropertyCard } from '@/components/dashboard/property-card';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  
  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [inputValue, setInputValue] = useState(params.q || '');
  
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Mock filters for now based on the design
  const [filters, setFilters] = useState([
    { id: 'cat', label: 'Category: House', type: 'category' },
    { id: 'price', label: 'Min Price: $500', type: 'price' },
    { id: 'beds', label: 'Beds: 2+', type: 'beds' }
  ]);

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const fetchResults = async (query: string) => {
    try {
      setIsLoading(true);
      const data = await UserService.getProperties({
        page: 1,
        page_size: 20,
        search: query,
        category: params.category // Add category if needed
      });
      
      setTotalCount(data.count);
      
      const mapped = (data.results || []).map(p => ({
        id: p.id,
        title: p.title,
        rating: 0,
        reviewsCount: p.views_count || 0,
        location: p.city ? `${p.address}, ${p.city}` : p.address,
        price: p.price,
        image: p.cover_photo || (p.images?.length > 0 ? p.images[0].image : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'),
        badge: p.category_name || 'Property',
        isSaved: p.is_saved || false,
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        size: p.total_rooms || 0,
      }));
      setResults(mapped);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or trigger fetch when query changes
    const timer = setTimeout(() => {
      fetchResults(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Search</ThemedText>
      </View>

      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.light.tintRed} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={() => setSearchQuery(inputValue)}
            placeholder="What are you looking for?"
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
          />
          {inputValue.length > 0 && (
            <TouchableOpacity onPress={() => { setInputValue(''); setSearchQuery(''); }}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      {filters.length > 0 && (
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {filters.map(filter => {
              const isCategory = filter.type === 'category';
              return (
                <View 
                  key={filter.id} 
                  style={[
                    styles.chip, 
                    isCategory ? styles.chipActive : styles.chipInactive
                  ]}
                >
                  <Text style={[styles.chipText, isCategory ? styles.chipTextActive : styles.chipTextInactive]}>
                    {filter.label}
                  </Text>
                  <TouchableOpacity onPress={() => removeFilter(filter.id)} style={styles.chipClose}>
                    <Ionicons 
                      name="close" 
                      size={14} 
                      color={isCategory ? Colors.light.tintRed : "#64748B"} 
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Showing <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{totalCount}</Text> results {searchQuery ? `for "${searchQuery}"` : ''}
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color="#1E293B" style={{ marginRight: 4 }} />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.light.tintRed} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PropertyCard property={item} fullWidth />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyText}>No properties found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.tintRed,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.tintRed,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsContainer: {
    marginBottom: Spacing.three,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.four,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: {
    borderColor: Colors.light.tintRed,
    backgroundColor: '#FEF2F2',
  },
  chipInactive: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.light.tintRed,
  },
  chipTextInactive: {
    color: '#64748B',
  },
  chipClose: {
    marginLeft: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryText: {
    fontSize: 13,
    color: '#64748B',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.four,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
  }
});
