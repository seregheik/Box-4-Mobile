import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AgentService, AgentProfile } from '@/services/agent.service';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await AgentService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !profile) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.tintBlue} />
      </ThemedView>
    );
  }

  const avatarUrl = profile?.profile_picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop';
  const name = profile?.user?.full_name || 'Agent';
  const email = profile?.user?.email || 'No email provided';
  const location = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || 'No location set';

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.tintBlue }]}>
            <Ionicons name="notifications-outline" size={24} color={theme.tintBlue} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: avatarUrl }} 
            style={styles.avatar} 
          />
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText style={styles.email} themeColor="textSecondary">{email}</ThemedText>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { borderColor: theme.tintBlue }]}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>-</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Listings</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.tintBlue }]} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>-</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Sold</ThemedText>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <InfoRow icon="call-outline" label="Phone" value={profile?.phone_number || 'Not provided'} />
          <InfoRow icon="location-outline" label="Location" value={location} />
          {profile?.agency_name && <InfoRow icon="business-outline" label="Agency" value={profile.agency_name} />}
          {profile?.license_number && <InfoRow icon="id-card-outline" label="License" value={profile.license_number} />}
          {profile?.rating !== null && profile?.rating !== undefined && <InfoRow icon="star-outline" label="Rating" value={`${profile.rating} / 5.0`} />}
          {profile?.bio && (
            <View style={styles.bioContainer}>
              <ThemedText style={styles.bioLabel} themeColor="textSecondary">Bio</ThemedText>
              <ThemedText style={styles.bioText}>{profile.bio}</ThemedText>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem 
            icon="settings-outline" 
            label="Account settings" 
            onPress={() => router.push('/(agent)/profile/account-settings')} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            label="Get help" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="document-text-outline" 
            label="Legal" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="shield-checkmark-outline" 
            label="Verify identity" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="arrow-up-outline" 
            label="Upgrade account" 
            onPress={() => {}} 
          />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void }) {
  const theme = useTheme();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={theme.text} style={styles.menuIcon} />
      <ThemedText style={styles.menuLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={theme.tintBlue} style={styles.infoIcon} />
      <View style={styles.infoTextContainer}>
        <ThemedText style={styles.infoLabel} themeColor="textSecondary">{label}</ThemedText>
        <ThemedText style={styles.infoValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.five,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.three,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 0, 
    marginHorizontal: Spacing.six,
    marginBottom: Spacing.six,
    paddingVertical: Spacing.three,
    backgroundColor: 'transparent',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    paddingHorizontal: Spacing.two,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    marginBottom: Spacing.two,
  },
  menuIcon: {
    marginRight: Spacing.three,
  },
  menuLabel: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: Spacing.six,
    paddingHorizontal: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  infoIcon: {
    marginRight: Spacing.three,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  bioContainer: {
    marginTop: Spacing.two,
    paddingTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  bioLabel: {
    fontSize: 12,
    marginBottom: Spacing.two,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  }
});
