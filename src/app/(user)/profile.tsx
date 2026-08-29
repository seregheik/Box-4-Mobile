import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/auth.store';
import { UserService, BuyerProfile } from '@/services/user.service';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { clearAuth } = useAuthStore();
  
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getBuyerProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch buyer profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      clearAuth();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={theme.tintRed} />
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ThemedText>Failed to load profile.</ThemedText>
        <TouchableOpacity onPress={fetchProfile} style={{ marginTop: 20 }}>
          <ThemedText style={{ color: theme.tintRed }}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const calculateCompletion = (p: BuyerProfile) => {
    let completed = 0;
    let total = 7; // full_name, phone_number, city, state, country, bio, profile_picture
    
    if (p.full_name) completed++;
    if (p.phone_number) completed++;
    if (p.city) completed++;
    if (p.state) completed++;
    if (p.country) completed++;
    if (p.bio) completed++;
    if (p.profile_picture) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = profile ? calculateCompletion(profile) : 0;
  const locationString = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ');

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/(user)/edit-profile',
              params: { profileData: JSON.stringify(profile) }
            })}
          >
            <ThemedText style={{ color: theme.tintRed, fontWeight: 'bold' }}>Edit Profile</ThemedText>
          </TouchableOpacity>

          <View style={styles.profileImageContainer}>
            {profile.profile_picture ? (
              <Image source={{ uri: profile.profile_picture }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="person" size={40} color={theme.textSecondary} />
              </View>
            )}
          </View>
          
          <ThemedText style={styles.nameText}>{profile.full_name || 'No Name'}</ThemedText>
          <ThemedText style={styles.emailText} themeColor="textSecondary">
            {profile.user.email}
          </ThemedText>
        </View>

        {/* Completion Banner */}
        {completionPercentage < 100 && (
          <View style={[styles.completionBanner, { backgroundColor: 'rgba(245, 166, 35, 0.1)' }]}>
            <View style={styles.completionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="warning" size={20} color="#f5a623" style={{ marginRight: Spacing.two }} />
                <ThemedText style={{ fontWeight: 'bold', color: '#f5a623' }}>Profile Incomplete</ThemedText>
              </View>
              <ThemedText style={{ fontWeight: 'bold', color: '#f5a623' }}>{completionPercentage}%</ThemedText>
            </View>
            <ThemedText style={{ fontSize: 13, color: '#f5a623', marginBottom: Spacing.three, marginTop: Spacing.one }}>
              Please complete your profile to get the most out of Box-4-Mobile.
            </ThemedText>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${completionPercentage}%`, backgroundColor: '#f5a623' }]} />
            </View>

            <TouchableOpacity 
              style={[styles.completeButton, { backgroundColor: '#f5a623' }]}
              onPress={() => router.push({
                pathname: '/(user)/edit-profile',
                params: { profileData: JSON.stringify(profile) }
              })}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Complete Profile</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <View style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color={theme.text} />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel} themeColor="textSecondary">Phone Number</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.phone_number || 'Not provided'}</ThemedText>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location-outline" size={20} color={theme.text} />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel} themeColor="textSecondary">Location</ThemedText>
                <ThemedText style={styles.infoValue}>{locationString || 'Not provided'}</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle-outline" size={20} color={theme.text} />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel} themeColor="textSecondary">Bio</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.bio || 'Not provided'}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <View style={[styles.actionCard, { backgroundColor: theme.backgroundElement }]}>
            <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(229, 32, 32, 0.1)' }]}>
                <Ionicons name="log-out-outline" size={20} color={Colors.light.tintRed} />
              </View>
              <ThemedText style={[styles.actionText, { color: Colors.light.tintRed }]}>Log Out</ThemedText>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.four,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.six,
    marginTop: Spacing.two,
  },
  profileImageContainer: {
    marginBottom: Spacing.three,
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
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  infoCard: {
    borderRadius: 16,
    padding: Spacing.four,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginVertical: Spacing.three,
    marginLeft: 52, // Align with text
  },
  actionsSection: {
    marginBottom: Spacing.four,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: Spacing.two,
  },
  completionBanner: {
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.six,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: Spacing.three,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  completeButton: {
    paddingVertical: Spacing.two,
    borderRadius: 8,
    alignItems: 'center',
  }
});
