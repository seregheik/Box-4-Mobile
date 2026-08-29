import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserService, BuyerProfile } from '@/services/user.service';
import { AgentService } from '@/services/agent.service';
import { BackButton } from '@/components/back-button';


export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  const { profileData } = useLocalSearchParams();

  useEffect(() => {
    if (profileData) {
      try {
        const data = JSON.parse(profileData as string) as BuyerProfile;
        setProfile(data);
        setFullName(data.full_name || data.user.full_name || '');
        setPhoneNumber(data.phone_number || '');
        setCity(data.city || '');
        setState(data.state || '');
        setCountry(data.country || '');
        setBio(data.bio || '');
        setProfilePicture(data.profile_picture || null);
        setIsLoading(false);
      } catch (e) {
        fetchProfile();
      }
    } else {
      fetchProfile();
    }
  }, [profileData]);

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      router.replace('/(user)/profile');
      return true; // Prevent default behavior (which goes to home)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getBuyerProfile();
      setProfile(data);
      setFullName(data.full_name || data.user.full_name || '');
      setPhoneNumber(data.phone_number || '');
      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || '');
      setBio(data.bio || '');
      setProfilePicture(data.profile_picture || null);
    } catch (error) {
      console.error('Failed to fetch buyer profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleGPSLocation = async () => {
    try {
      setIsFetchingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        if (place.city || place.subregion) setCity(place.city || place.subregion || '');
        if (place.region) setState(place.region);
        if (place.country) setCountry(place.country);
      }
    } catch (error) {
      console.error('Error fetching location', error);
      alert('Could not fetch location.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      let finalProfilePictureUrl = profile?.profile_picture || '';
      
      // Upload new picture if it's a local file
      if (profilePicture && !profilePicture.startsWith('http')) {
        const filename = profilePicture.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        const uploadData = new FormData();
        uploadData.append("file", {
          uri: profilePicture,
          name: filename,
          type,
        } as any);

        const uploadResult = await AgentService.uploadMedia(uploadData);
        finalProfilePictureUrl = uploadResult.relative_url;
      }
      
      await UserService.updateBuyerProfile({
        full_name: fullName,
        phone_number: phoneNumber,
        city: city,
        state: state,
        country: country,
        bio: bio,
        ...(finalProfilePictureUrl ? { profile_picture: finalProfilePictureUrl } : {})
      });
      
      router.replace('/(user)/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.tintRed} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.replace('/(user)/profile')} />
        <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="person" size={40} color={theme.textSecondary} />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <View style={styles.locationSectionHeader}>
            <ThemedText style={styles.sectionSubTitle}>Location</ThemedText>
            <TouchableOpacity onPress={handleGPSLocation} style={styles.gpsButton}>
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color={theme.tintRed} />
              ) : (
                <>
                  <Ionicons name="navigate" size={16} color={theme.tintRed} />
                  <ThemedText style={[styles.gpsText, { color: theme.tintRed }]}>Use GPS</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Search Address</ThemedText>
            <View style={styles.autocompleteWrapper}>
              <GooglePlacesAutocomplete
                placeholder="Search for a city, state, or country..."
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (details) {
                    let extractedCity = '';
                    let extractedState = '';
                    let extractedCountry = '';
                    
                    details.address_components.forEach(component => {
                      if (component.types.includes('locality')) extractedCity = component.long_name;
                      if (!extractedCity && component.types.includes('administrative_area_level_2')) extractedCity = component.long_name; // Fallback to county/subregion
                      if (component.types.includes('administrative_area_level_1')) extractedState = component.long_name;
                      if (component.types.includes('country')) extractedCountry = component.long_name;
                    });
                    
                    if (extractedCity) setCity(extractedCity);
                    if (extractedState) setState(extractedState);
                    if (extractedCountry) setCountry(extractedCountry);
                  }
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                  language: 'en',
                }}
                styles={{
                  textInputContainer: {
                    width: '100%',
                    backgroundColor: theme.backgroundElement,
                    borderRadius: 12,
                  },
                  textInput: {
                    height: 52,
                    color: theme.text,
                    fontSize: 16,
                    backgroundColor: 'transparent',
                    paddingHorizontal: Spacing.three,
                  },
                  listView: {
                    backgroundColor: theme.background,
                    borderRadius: 12,
                    marginTop: Spacing.one,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  },
                  row: {
                    backgroundColor: theme.background,
                    padding: Spacing.three,
                    height: 44,
                    flexDirection: 'row',
                  },
                  description: {
                    color: theme.text,
                  }
                }}
                textInputProps={{
                  placeholderTextColor: theme.textSecondary,
                }}
                enablePoweredByContainer={false}
              />
            </View>
          </View>

          <View style={styles.rowGroup}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
              <ThemedText style={styles.label}>City</ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={city}
                  onChangeText={setCity}
                  placeholder="City"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.two }]}>
              <ThemedText style={styles.label}>State</ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={state}
                  onChangeText={setState}
                  placeholder="State"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Country</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Bio</ThemedText>
            <View style={[styles.inputWrapper, { backgroundColor: theme.backgroundElement, minHeight: 100, alignItems: 'flex-start', paddingTop: Spacing.two }]}>
              <TextInput
                style={[styles.input, { color: theme.text, height: '100%', textAlignVertical: 'top' }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us a bit about yourself"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
          
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Footer Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || Spacing.four, borderTopColor: theme.border }]}>
        <ThemedButton
          title="Save Changes"
          variant="danger"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
        />
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six * 2,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
    marginTop: Spacing.two,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.tintRed,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  formSection: {
    marginBottom: Spacing.six,
  },
  locationSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    marginTop: Spacing.four,
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    backgroundColor: 'rgba(214, 2, 2, 0.1)',
    borderRadius: 8,
  },
  gpsText: {
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  autocompleteWrapper: {
    position: 'relative',
    zIndex: 1, // Ensure dropdown appears over other elements
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  }
});
