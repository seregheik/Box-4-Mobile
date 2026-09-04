import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
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

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      if (!profile) setIsLoading(true);
      const data = await UserService.getBuyerProfile();
      // React will automatically diff and update only the changed fields on the screen
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

  // Only show the full-screen loader if we have NO profile data at all
  if (isLoading && !profile) {
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
    
    if (p.full_name || p.user?.full_name) completed++;
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
        
        {/* Top Header Row */}
        <View style={styles.topHeaderRow}>
          <ThemedText style={styles.pageTitle}>Profile</ThemedText>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/(user)/edit-profile',
              params: { profileData: JSON.stringify(profile) }
            })}
          >
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Profile Info Section */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {profile.profile_picture ? (
              <Image source={{ uri: profile.profile_picture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#94A3B8" />
              </View>
            )}
          </View>
          
          <ThemedText style={styles.nameText}>
            {profile.full_name || profile.user.full_name || "No Name"}
          </ThemedText>
          <ThemedText style={styles.emailText}>
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
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={16} color="#64748B" />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel}>PHONE NUMBER</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.phone_number || 'Not provided'}</ThemedText>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location-sharp" size={16} color="#64748B" />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel}>LOCATION</ThemedText>
                <ThemedText style={styles.infoValue}>{locationString || 'Not provided'}</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle" size={16} color="#64748B" />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText style={styles.infoLabel}>BIO</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.bio || 'Not provided'}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <View style={styles.actionCard}>
            <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="log-out-outline" size={20} color="#D60202" />
              </View>
              <ThemedText style={styles.actionText}>Log Out</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#D60202" />
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
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(214, 2, 2, 0.05)',
    borderRadius: 4,
  },
  editButtonText: {
    color: '#D60202',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileImageContainer: {
    marginBottom: Spacing.three,
    padding: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1E293B',
  },
  emailText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoSection: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
    color: '#1E293B',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 4,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  actionsSection: {
    marginBottom: Spacing.four,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: 'rgba(214, 2, 2, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(214, 2, 2, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D60202',
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
