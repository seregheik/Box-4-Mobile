import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Router will handle redirect automatically if using a top-level auth gate
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.backgroundElement }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={[styles.headerPill, { backgroundColor: theme.backgroundElement }]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.headerAvatar} 
            />
            <View>
              <ThemedText style={styles.headerName}>Clinton</ThemedText>
              <ThemedText style={styles.headerEmail} themeColor="textSecondary">Clintontamaremi@gmail.com</ThemedText>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem icon="person-outline" label="Personal information" onPress={() => {}} />
          <MenuItem icon="enter-outline" label="Login & Security" onPress={() => {}} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy" onPress={() => {}} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <MenuItem icon="finger-print-outline" label="Verify identity" onPress={() => {}} />
          <MenuItem icon="power-outline" label="logout" onPress={handleLogout} isDestructive />
        </View>

      </ScrollView>
    </ThemedView>
  );
}

function MenuItem({ icon, label, isDestructive, onPress }: { icon: keyof typeof Ionicons.glyphMap, label: string, isDestructive?: boolean, onPress: () => void }) {
  const theme = useTheme();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={isDestructive ? theme.tintRed : theme.text} style={styles.menuIcon} />
      <ThemedText style={[styles.menuLabel, isDestructive && { color: theme.tintRed }]}>{label}</ThemedText>
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
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 30,
    flex: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.two,
  },
  headerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerEmail: {
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
