import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { NearestProperty, UserService } from '@/services/user.service';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [property, setProperty] = useState<NearestProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails(id as string);
    }
  }, [id]);

  const fetchPropertyDetails = async (propertyId: string) => {
    try {
      setIsLoading(true);
      const data = await UserService.getPropertyById(propertyId);
      setProperty(data);
      setIsSaved(data.is_saved || false);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaved = async () => {
    setIsSaved(!isSaved);
    try {
      if (property) {
        await UserService.toggleSavedProperty(property.id);
      }
    } catch (error) {
      console.error('Failed to toggle saved property:', error);
      setIsSaved(isSaved);
    }
  };

  if (isLoading || !property) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.tintRed} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Image Area */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: property.cover_photo || property.images?.[0]?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }} 
            style={styles.image}
          />
          
          {/* Top Actions */}
          <View style={[styles.topActions, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social" size={20} color="#1E293B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={toggleSaved}>
                <Ionicons 
                  name={isSaved ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isSaved ? Colors.light.tintRed : "#1E293B"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badges Overlay */}
          <View style={styles.badgesOverlay}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(property.category_name || property.category) && (
                <View style={[styles.badge, { backgroundColor: Colors.light.tintRed }]}>
                  <Text style={styles.badgeText}>
                    {(property.category_name || property.category).toUpperCase()}
                  </Text>
                </View>
              )}
              {property.is_featured && (
                <View style={[styles.badge, { backgroundColor: '#1E293B' }]}>
                  <Ionicons name="star" size={10} color="#FBBF24" style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>FEATURED</Text>
                </View>
              )}
            </View>
            {property.images && property.images.length > 0 && (
              <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Ionicons name="images" size={10} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>1/{property.images.length}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Title & Price Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{property.title}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={Colors.light.tintRed} />
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>${Number(property.price).toLocaleString()}</Text>
              <Text style={styles.priceUnit}> / month</Text>
            </View>
            
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={Colors.light.tintRed} />
              <Text style={styles.locationText}>
                {[property.address, property.city, property.state, property.country].filter(Boolean).join(', ')}
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statInfo}>
                <Ionicons name="eye-outline" size={14} color="#64748B" />
                <Text style={styles.statInfoText}>{property.views_count} Views</Text>
              </View>
              <View style={styles.statInfo}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.statInfoText}>Updated recently</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Ionicons name="bed-outline" size={24} color="#64748B" />
                <Text style={styles.detailBoxValue}>{property.bedrooms}</Text>
                <Text style={styles.detailBoxLabel}>BEDS</Text>
              </View>
              <View style={styles.detailBox}>
                <Ionicons name="water-outline" size={24} color="#64748B" />
                <Text style={styles.detailBoxValue}>{property.bathrooms}</Text>
                <Text style={styles.detailBoxLabel}>BATHS</Text>
              </View>
              <View style={styles.detailBox}>
                <MaterialCommunityIcons name="balcony" size={24} color="#64748B" />
                <Text style={styles.detailBoxValue}>{property.balconies}</Text>
                <Text style={styles.detailBoxLabel}>BALCONY</Text>
              </View>
              <View style={styles.detailBox}>
                <Ionicons name="grid-outline" size={24} color="#64748B" />
                <Text style={styles.detailBoxValue}>{property.total_rooms}</Text>
                <Text style={styles.detailBoxLabel}>ROOMS</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Facilities */}
          {property.facilities && property.facilities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facilities</Text>
              <View style={styles.facilitiesContainer}>
                {property.facilities.map((item, index) => (
                  <View key={index} style={styles.facilityChip}>
                    <Ionicons name="checkmark" size={16} color={Colors.light.tintRed} />
                    <Text style={styles.facilityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Location Area */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.coordsText}>{property.latitude}, {property.longitude}</Text>
            
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapPin}>
                <View style={styles.mapPinInner}>
                  <Ionicons name="business" size={16} color="#FFF" />
                </View>
              </View>
              <View style={styles.mapLabel}>
                <Text style={styles.mapLabelText}>Google Maps Area</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Listed By */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed By</Text>
            <View style={styles.agentCard}>
              <View style={styles.agentInfo}>
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?u=' + property.agent }} 
                  style={styles.agentAvatar} 
                />
                <View>
                  <Text style={styles.agentName}>{property.agent_name}</Text>
                  <Text style={styles.agentRole}>REAL ESTATE AGENT</Text>
                </View>
              </View>
              <View style={styles.agentActions}>
                <TouchableOpacity style={styles.agentBtn}>
                  <Ionicons name="call" size={16} color="#1E293B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.agentBtn}>
                  <Ionicons name="chatbubble-ellipses" size={16} color="#1E293B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View>
          <Text style={styles.footerLabel}>TOTAL PRICE</Text>
          <Text style={styles.footerPrice}>${Number(property.price).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgesOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.tintRed,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tintRed,
  },
  priceUnit: {
    fontSize: 14,
    color: '#64748B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statInfoText: {
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  section: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailBox: {
    flex: 1,
    minWidth: '22%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBoxValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  detailBoxLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  facilityText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  coordsText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  mapPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(214, 2, 2, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapPinInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.tintRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabel: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 12,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  agentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  agentRole: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  agentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  agentBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tintRed,
  },
  bookButton: {
    backgroundColor: Colors.light.tintRed,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
