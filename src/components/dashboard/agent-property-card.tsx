import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Listing } from '@/services/agent.service';

interface AgentPropertyCardProps {
  property: Listing;
}

export function AgentPropertyCard({ property }: AgentPropertyCardProps) {
  const theme = useTheme();
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => router.push({
        pathname: '/(agent)/listing/[id]',
        params: { id: property.id, initialData: JSON.stringify(property) }
      })}
    >
      <ThemedView type="backgroundElement" style={styles.container}>
      <Image source={{ uri: property.cover_photo }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title} numberOfLines={1}>{property.title}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: property.status.toLowerCase() === 'active' ? '#7BC043' : '#f5a623' }]}>
            <ThemedText style={styles.statusText}>{property.status.toUpperCase()}</ThemedText>
          </View>
        </View>
        <ThemedText themeColor="textSecondary" style={styles.address} numberOfLines={1}>{property.address}</ThemedText>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={14} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.statText}>{property.views_count}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={14} color={theme.textSecondary} />
            <ThemedText themeColor="textSecondary" style={styles.statText}>{property.inquiries_count}</ThemedText>
          </View>
          <ThemedText style={[styles.price, { color: theme.tintBlue }]}>N {property.price.split('.')[0]}</ThemedText>
        </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: Spacing.two,
    marginBottom: Spacing.three,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.three,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 12,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.three,
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  price: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
