import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export interface Property {
  id: string;
  title: string;
  address: string;
  location: string;
  price: string;
  image: string;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.image} />
        
        <TouchableOpacity style={styles.favoriteBtn}>
          <Ionicons name="heart-outline" size={16} color={Colors.light.tintRed} />
        </TouchableOpacity>

        <View style={styles.priceBadge}>
          <ThemedText style={styles.priceText}>N {property.price}</ThemedText>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>{property.title}</ThemedText>
        <ThemedText style={styles.address} numberOfLines={1}>{property.address}</ThemedText>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#64748B" />
          <ThemedText style={styles.locationText} numberOfLines={1}>{property.location}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    width: '100%',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.light.tintRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  address: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
});
