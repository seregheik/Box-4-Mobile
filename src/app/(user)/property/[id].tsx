import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, ActivityIndicator, FlatList, Modal, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { NearestProperty, UserService } from '@/services/user.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ZoomableImage = ({ uri, width, height, isActive, onZoomChange }: { uri: string, width: number, height: number, isActive: boolean, onZoomChange: (zoomed: boolean) => void }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
      scale.value = withTiming(1);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
      onZoomChange(false);
    }
  }, [isActive]);

  const checkZoom = (currentScale: number) => {
    'worklet';
    if (currentScale > 1.05) {
      runOnJS(onZoomChange)(true);
    } else {
      runOnJS(onZoomChange)(false);
    }
  };

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX - width / 2;
      focalY.value = e.focalY - height / 2;
    })
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
      
      const newTranslateX = focalX.value - focalX.value * (scale.value / savedScale.value);
      const newTranslateY = focalY.value - focalY.value * (scale.value / savedScale.value);
      
      translateX.value = savedTranslateX.value + newTranslateX;
      translateY.value = savedTranslateY.value + newTranslateY;
    })
    .onEnd(() => {
      if (scale.value < 1.05) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        checkZoom(1);
      } else {
        savedScale.value = scale.value;
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
        checkZoom(scale.value);
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ]
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.Image 
        source={{ uri }} 
        style={[{ width, height, resizeMode: 'contain' }, animatedStyle]} 
      />
    </GestureDetector>
  );
};

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [property, setProperty] = useState<NearestProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [activeFullScreenIndex, setActiveFullScreenIndex] = useState(0);
  const fullScreenListRef = useRef<FlatList>(null);
  const mainListRef = useRef<FlatList>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = property?.images?.length 
    ? property.images.map(img => img.image) 
    : [property?.cover_photo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'];

  useEffect(() => {
    if (isFullScreen) {
      setActiveFullScreenIndex(activeImageIndex);
    }
  }, [isFullScreen, activeImageIndex]);

  useEffect(() => {
    if (images.length <= 1 || isFullScreen) return;

    const timer = setTimeout(() => {
      const nextIndex = activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1;
      mainListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeImageIndex, images.length, isFullScreen]);

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



  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveImageIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Actions */}
      <View style={[styles.topActions, { top: Math.max(insets.top, 16), zIndex: 10 }]}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Image Area */}
        <View style={styles.imageContainer}>
          <FlatList 
            ref={mainListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.9} onPress={() => setIsFullScreen(true)}>
                <Image source={{ uri: item }} style={[styles.image, { width: SCREEN_WIDTH }]} />
              </TouchableOpacity>
            )}
          />

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
            {images.length > 0 && (
              <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Ionicons name="images" size={10} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>{activeImageIndex + 1}/{images.length}</Text>
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

      {/* Full Screen Image Modal */}
      <Modal visible={isFullScreen} transparent={true} animationType="fade" onRequestClose={() => setIsFullScreen(false)}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.fullScreenContainer}>
          <View style={[styles.fullScreenHeader, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsFullScreen(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>{activeFullScreenIndex + 1} of {images.length}</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <FlatList
            ref={fullScreenListRef}
            data={images}
            horizontal
            pagingEnabled
            scrollEnabled={!isZoomed}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeImageIndex}
            onScroll={(event) => {
              const slideSize = event.nativeEvent.layoutMeasurement.width;
              const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
              setActiveFullScreenIndex(index);
            }}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ width: SCREEN_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ZoomableImage 
                  uri={item} 
                  width={SCREEN_WIDTH} 
                  height={SCREEN_HEIGHT} 
                  isActive={index === activeFullScreenIndex}
                  onZoomChange={setIsZoomed}
                />
              </View>
            )}
          />

          {/* Navigation Arrows when zoomed */}
          {isZoomed && activeFullScreenIndex > 0 && (
            <TouchableOpacity 
              style={styles.navButtonLeft} 
              onPress={() => {
                const prevIndex = activeFullScreenIndex - 1;
                setActiveFullScreenIndex(prevIndex);
                fullScreenListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
                setIsZoomed(false);
              }}
            >
              <Ionicons name="chevron-back" size={32} color="#FFF" />
            </TouchableOpacity>
          )}
          {isZoomed && activeFullScreenIndex < images.length - 1 && (
            <TouchableOpacity 
              style={styles.navButtonRight} 
              onPress={() => {
                const nextIndex = activeFullScreenIndex + 1;
                setActiveFullScreenIndex(nextIndex);
                fullScreenListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                setIsZoomed(false);
              }}
            >
              <Ionicons name="chevron-forward" size={32} color="#FFF" />
            </TouchableOpacity>
          )}

          {/* Pinch to zoom hint */}
          <View style={[styles.zoomHintContainer, { bottom: Math.max(insets.bottom, 16) + 90 }]}>
            <Ionicons name="search-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.zoomHintText}>Pinch to zoom</Text>
          </View>

          {/* Thumbnails at the bottom */}
          <View style={[styles.thumbnailContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  onPress={() => {
                    setActiveFullScreenIndex(index);
                    fullScreenListRef.current?.scrollToIndex({ index, animated: true });
                  }}
                >
                  <Image 
                    source={{ uri: item }} 
                    style={[
                      styles.thumbnailImage, 
                      index === activeFullScreenIndex && styles.activeThumbnail
                    ]} 
                  />
                </TouchableOpacity>
              )}
            />
          </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
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
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullScreenHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  fullScreenTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: Colors.light.tintRed,
  },
  zoomHintContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 20,
  },
  zoomHintText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  navButtonLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -24,
    zIndex: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8,
  },
  navButtonRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -24,
    zIndex: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8,
  },
});
