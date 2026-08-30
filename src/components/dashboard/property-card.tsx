import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <Image 
          source={{ uri: property.image }} 
          style={styles.image} 
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }}
        />
        
        <TouchableOpacity style={styles.favoriteBtn}>
          <Ionicons name="heart-outline" size={16} color={Colors.light.tintRed} />
        </TouchableOpacity>

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>N {property.price}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        <Text style={styles.address} numberOfLines={1}>{property.address}</Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#64748B" />
          <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220, // Match FeaturedCard for consistency
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginRight: Spacing.three,
    overflow: 'hidden',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
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
