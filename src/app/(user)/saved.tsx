import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Colors } from '@/constants/theme';
import { UserService, SavedProperty } from '@/services/user.service';
import { PropertyCard } from '@/components/dashboard/property-card';

export default function SavedScreen() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedProperties = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getSavedProperties();
      setSavedProperties(data.results || []);
    } catch (error) {
      console.error('Failed to fetch saved properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedProperties();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Saved Properties</ThemedText>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={Colors.light.tintRed} />
          </View>
        ) : savedProperties.length === 0 ? (
          <View style={styles.centerContent}>
            <ThemedText style={styles.emptyText}>You haven't saved any properties yet.</ThemedText>
          </View>
        ) : (
          <FlatList
            data={savedProperties}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const details = item.listing_details;
              
              const mappedProperty = {
                id: details.id,
                title: details.title,
                rating: 0,
                reviewsCount: details.views_count || 0,
                location: details.city ? `${details.address}, ${details.city}` : details.address,
                price: details.price,
                image: details.cover_photo || (details.images?.length > 0 ? details.images[0].image : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'),
                badge: details.category_name || 'Property',
                isSaved: true,
                bedrooms: details.bedrooms || 0,
                bathrooms: details.bathrooms || 0,
                size: 0,
              };

              return <PropertyCard property={mappedProperty} fullWidth />;
            }}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: { 
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.eight,
    gap: Spacing.four,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  }
});
