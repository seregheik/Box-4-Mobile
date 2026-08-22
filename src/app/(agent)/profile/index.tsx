import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}>
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
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.avatar} 
          />
          <ThemedText style={styles.name}>Clinton</ThemedText>
          <ThemedText style={styles.email} themeColor="textSecondary">Clintontamaremi@email.com</ThemedText>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { borderColor: theme.tintBlue }]}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>30</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Listings</ThemedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.tintBlue }]} />
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>12</ThemedText>
            <ThemedText style={styles.statLabel} themeColor="textSecondary">Sold</ThemedText>
          </View>
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
});
