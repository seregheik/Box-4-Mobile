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
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'transparent' }]}>
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Hero Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { shadowColor: theme.tintBlue }]}>
            <Image 
              source={{ uri: avatarUrl }} 
              style={styles.avatar} 
            />
          </View>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText style={[styles.email, { color: theme.tintBlue }]}>{email}</ThemedText>
        </View>

        {/* Personal Information List */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.sectionTitle}>Information</ThemedText>
          <ThemedView type="backgroundElement" style={styles.infoListBlock}>
            <InfoRow icon="call" label="Phone" value={profile?.phone_number || 'N/A'} />
            <InfoRow icon="location" label="Location" value={location} />
            <InfoRow icon="business" label="Agency" value={profile?.agency_name || 'Independent'} />
            {profile?.license_number && <InfoRow icon="id-card" label="License" value={profile.license_number} />}
            {profile?.rating !== null && profile?.rating !== undefined && (
              <InfoRow icon="star" label="Rating" value={`${profile.rating} / 5.0`} color="#FFB300" isLast />
            )}
          </ThemedView>

          {profile?.bio && (
            <ThemedView type="backgroundElement" style={styles.bioCard}>
              <View style={styles.bioHeader}>
                <Ionicons name="person-circle" size={20} color={theme.tintBlue} style={styles.cardIcon} />
                <ThemedText style={styles.cardLabel} themeColor="textSecondary">Bio</ThemedText>
              </View>
              <ThemedText style={styles.bioText}>{profile.bio}</ThemedText>
            </ThemedView>
          )}
        </View>

        {/* Unified Settings Block */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          <ThemedView type="backgroundElement" style={styles.settingsBlock}>
            <MenuItem icon="settings" label="Account settings" onPress={() => router.push('/(agent)/profile/account-settings')} isFirst />
            <MenuItem icon="help-buoy" label="Get help" onPress={() => {}} />
            <MenuItem icon="document-text" label="Legal" onPress={() => {}} />
            <MenuItem icon="shield-checkmark" label="Verify identity" onPress={() => {}} />
            <MenuItem icon="arrow-up-circle" label="Upgrade account" onPress={() => {}} isLast />
          </ThemedView>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

function InfoRow({ icon, label, value, color, isLast = false }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string, color?: string, isLast?: boolean }) {
  const theme = useTheme();
  const iconColor = color || theme.tintBlue;
  
  return (
    <View style={[styles.infoRowWrapper, !isLast && { borderBottomColor: theme.border || '#ccc', borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={styles.infoRow}>
        <View style={styles.infoRowLeft}>
          <Ionicons name={icon} size={20} color={iconColor} style={styles.infoRowIcon} />
          <ThemedText style={styles.infoRowLabel} themeColor="textSecondary">{label}</ThemedText>
        </View>
        <ThemedText style={styles.infoRowValue} numberOfLines={1}>{value}</ThemedText>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress, isFirst = false, isLast = false }: { icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void, isFirst?: boolean, isLast?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.menuItemWrapper, !isLast && { borderBottomColor: theme.border || '#ccc', borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuItemLeft}>
          <Ionicons name={icon} size={22} color={theme.text} style={styles.menuIcon} />
          <ThemedText style={styles.menuLabel}>{label}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  avatarContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: Spacing.four,
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 4,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  infoListBlock: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: Spacing.four,
  },
  infoRowWrapper: {
    paddingHorizontal: Spacing.four,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  infoRowIcon: {
    marginRight: 10,
  },
  infoRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRowValue: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  bioCard: {
    padding: Spacing.four,
    borderRadius: 20,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardIcon: {
    marginRight: 6,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
  },
  settingsSection: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.six,
  },
  settingsBlock: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItemWrapper: {
    paddingHorizontal: Spacing.four,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Spacing.three,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
