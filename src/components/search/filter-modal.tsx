import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Switch,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { UserService, Category } from '@/services/user.service';

export interface FilterState {
  search?: string;
  category?: string;
  tags?: string[];
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: number;
  city?: string;
  state?: string;
  country?: string;
  proximitySearch?: boolean;
  latitude?: string;
  longitude?: string;
  radiusKm?: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const COMMON_TAGS = ['Luxury', 'Furnished', 'New Build', 'Pool'];

export function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  const insets = useSafeAreaInsets();
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form State
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  
  const [city, setCity] = useState('');
  const [stateText, setStateText] = useState('');
  const [country, setCountry] = useState('Nigeria');
  
  const [proximityEnabled, setProximityEnabled] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusKm, setRadiusKm] = useState(10); // 1 to 50

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (visible && initialFilters) {
      setKeyword(initialFilters.search || '');
      setSelectedCategory(initialFilters.category);
      setSelectedTags(initialFilters.tags || []);
      setMinPrice(initialFilters.minPrice || '');
      setMaxPrice(initialFilters.maxPrice || '');
      setBedrooms(initialFilters.bedrooms || 0);
      setCity(initialFilters.city || '');
      setStateText(initialFilters.state || '');
      setCountry(initialFilters.country || 'Nigeria');
      setProximityEnabled(initialFilters.proximitySearch || false);
      setLatitude(initialFilters.latitude || '');
      setLongitude(initialFilters.longitude || '');
      setRadiusKm(initialFilters.radiusKm || 10);
    }
  }, [visible, initialFilters]);

  useEffect(() => {
    if (proximityEnabled && (!latitude || !longitude)) {
      (async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Allow location access to use proximity search.');
            setProximityEnabled(false);
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setLatitude(location.coords.latitude.toFixed(6));
          setLongitude(location.coords.longitude.toFixed(6));
        } catch (error) {
          console.warn('Error fetching location:', error);
          Alert.alert('Location Error', 'Unable to fetch your location.');
          setProximityEnabled(false);
        }
      })();
    }
  }, [proximityEnabled]);

  const fetchCategories = async () => {
    try {
      const data = await UserService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    setKeyword('');
    setSelectedCategory(undefined);
    setSelectedTags([]);
    setMinPrice('');
    setMaxPrice('');
    setBedrooms(0);
    setCity('');
    setStateText('');
    setCountry('Nigeria');
    setProximityEnabled(false);
    setLatitude('');
    setLongitude('');
    setRadiusKm(10);
  };

  const handleApply = () => {
    onApply({
      search: keyword || undefined,
      category: selectedCategory,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms > 0 ? bedrooms : undefined,
      city: city || undefined,
      state: stateText || undefined,
      country: country || undefined,
      proximitySearch: proximityEnabled,
      latitude: proximityEnabled ? latitude : undefined,
      longitude: proximityEnabled ? longitude : undefined,
      radiusKm: proximityEnabled ? radiusKm : undefined,
    });
  };

  // Custom Slider Logic
  const sliderWidth = 280; // approximate width
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.moveX - 40; // approx offset from left
        newX = Math.max(0, Math.min(newX, sliderWidth));
        const percentage = newX / sliderWidth;
        const value = Math.round(1 + percentage * 49); // 1 to 50
        setRadiusKm(value);
      },
    })
  ).current;

  // Count active filters for the button
  let activeCount = 0;
  if (keyword) activeCount++;
  if (selectedCategory) activeCount++;
  if (selectedTags.length > 0) activeCount += selectedTags.length;
  if (minPrice) activeCount++;
  if (maxPrice) activeCount++;
  if (bedrooms > 0) activeCount++;
  if (city) activeCount++;
  if (stateText) activeCount++;
  if (proximityEnabled) activeCount++;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 0 : insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Filters</Text>
              <Text style={styles.headerSubtitle}>Refine your property search</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Keyword Search */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Keyword Search</Text>
              <Text style={styles.sectionDesc}>Search across title, category, tag, address, city, state</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="search" size={20} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="Luxury House"
                  placeholderTextColor="#94A3B8"
                  value={keyword}
                  onChangeText={setKeyword}
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.grid}>
                {categories.map(cat => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <TouchableOpacity 
                      key={cat.id} 
                      style={[styles.gridItem, isActive && styles.gridItemActive]}
                      onPress={() => setSelectedCategory(isActive ? undefined : cat.name)}
                    >
                      <Text style={[styles.gridItemText, isActive && styles.gridItemTextActive]}>{cat.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Tags */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <Text style={styles.sectionHint}>Select multiple</Text>
              </View>
              <View style={styles.grid}>
                {COMMON_TAGS.map(tag => {
                  const isActive = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity 
                      key={tag} 
                      style={[styles.gridItem, isActive && styles.gridItemActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[styles.gridItemText, isActive && styles.gridItemTextActive]}>{tag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>MIN PRICE</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.prefix}>$</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="500"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={minPrice}
                      onChangeText={setMinPrice}
                    />
                  </View>
                </View>
                <View style={{ width: 16 }} />
                <View style={styles.flex1}>
                  <Text style={styles.label}>MAX PRICE</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.prefix}>$</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Any"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={maxPrice}
                      onChangeText={setMaxPrice}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Rooms */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rooms (Minimum)</Text>
              <View style={styles.counterRow}>
                <View style={styles.counterLabel}>
                  <Ionicons name="bed" size={20} color="#64748B" style={{ marginRight: 8 }} />
                  <Text style={styles.counterLabelText}>Bedrooms</Text>
                </View>
                <View style={styles.counterControls}>
                  <TouchableOpacity 
                    style={styles.counterBtn} 
                    onPress={() => setBedrooms(Math.max(0, bedrooms - 1))}
                  >
                    <Ionicons name="remove" size={16} color="#1E293B" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{bedrooms}</Text>
                  <TouchableOpacity 
                    style={styles.counterBtn}
                    onPress={() => setBedrooms(bedrooms + 1)}
                  >
                    <Ionicons name="add" size={16} color="#1E293B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specific Location</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Benin City"
                  placeholderTextColor="#94A3B8"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              
              <View style={[styles.row, { marginTop: 16 }]}>
                <View style={[styles.inputContainer, styles.flex1]}>
                  <Ionicons name="map" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Edo"
                    placeholderTextColor="#94A3B8"
                    value={stateText}
                    onChangeText={setStateText}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={[styles.inputContainer, styles.flex1, { backgroundColor: '#F8FAFC' }]}>
                  <Ionicons name="globe" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nigeria"
                    placeholderTextColor="#94A3B8"
                    value={country}
                    onChangeText={setCountry}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            {/* Proximity Search */}
            <View style={styles.proximityCard}>
              <View style={styles.rowBetween}>
                <View style={styles.rowCenter}>
                  <Ionicons name="locate" size={20} color={Colors.light.tintRed} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionTitle}>Proximity Search</Text>
                </View>
                <Switch 
                  value={proximityEnabled} 
                  onValueChange={setProximityEnabled}
                  trackColor={{ false: '#E2E8F0', true: Colors.light.tintRed }}
                />
              </View>
              <Text style={styles.sectionDesc}>Find properties near your current GPS location.</Text>
              
              {proximityEnabled && (
                <>
                  <View style={[styles.row, { marginTop: 16 }]}>
                    <View style={[styles.inputContainer, styles.flex1, { backgroundColor: '#F8FAFC' }]}>
                      <Text style={styles.prefix}>Lat:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="6.3350"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={latitude}
                        onChangeText={setLatitude}
                      />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={[styles.inputContainer, styles.flex1, { backgroundColor: '#F8FAFC' }]}>
                      <Text style={styles.prefix}>Lng:</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="5.6275"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={longitude}
                        onChangeText={setLongitude}
                      />
                    </View>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 16 }]}>Search Radius</Text>
                    <View style={styles.radiusBadge}>
                      <Text style={styles.radiusBadgeText}>{radiusKm} km</Text>
                    </View>
                  </View>
                  
                  {/* Custom Slider */}
                  <View style={styles.sliderContainer} {...panResponder.panHandlers}>
                    <View style={styles.sliderTrack}>
                      <View style={[styles.sliderFill, { width: `${(radiusKm / 50) * 100}%` }]} />
                    </View>
                    <View style={[styles.sliderThumb, { left: `${(radiusKm / 50) * 100}%`, transform: [{ translateX: -10 }] }]} />
                  </View>
                  
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderLabelText}>1 km</Text>
                    <Text style={styles.sliderLabelText}>50 km</Text>
                  </View>
                </>
              )}
            </View>
            
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
              {activeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  closeButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
  },
  section: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 11,
    color: '#94A3B8',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
  },
  prefix: {
    color: '#64748B',
    marginRight: 8,
    fontSize: 14,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  gridItemActive: {
    borderColor: Colors.light.tintRed,
    backgroundColor: '#FEF2F2',
  },
  gridItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  gridItemTextActive: {
    color: Colors.light.tintRed,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  counterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterBtn: {
    padding: 4,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    minWidth: 20,
    textAlign: 'center',
  },
  proximityCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    marginBottom: Spacing.six,
    backgroundColor: '#FAFAFA',
  },
  radiusBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  radiusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.tintRed,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    marginTop: 8,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.light.tintRed,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.tintRed,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabelText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: Spacing.four,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  applyBtn: {
    flex: 2,
    backgroundColor: Colors.light.tintRed,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    flexDirection: 'row',
    gap: 8,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});
