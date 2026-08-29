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
        <ActivityIndicator size="large" color={theme.tintBlue} />
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ThemedText>Failed to load profile.</ThemedText>
        <TouchableOpacity onPress={fetchProfile} style={{ marginTop: 20 }}>
          <ThemedText style={{ color: theme.tintBlue }}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const locationString = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
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
});
