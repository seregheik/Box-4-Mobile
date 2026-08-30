import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface CircleItemProps {
  name: string;
  image: string;
  variant: 'horizontal' | 'vertical'; // horizontal for Locations, vertical for Agents
  subtitle?: string;
}

export function CircleItem({ name, image, variant, subtitle }: CircleItemProps) {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalContainer}>
        <Image source={{ uri: image }} style={styles.horizontalImage} />
        <View style={styles.horizontalTextContainer}>
          <ThemedText style={styles.horizontalText} numberOfLines={1}>{name}</ThemedText>
          {subtitle && <ThemedText style={styles.horizontalSubtitle}>{subtitle}</ThemedText>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalContainer}>
      <Image source={{ uri: image }} style={styles.verticalImage} />
      <ThemedText style={styles.verticalText} numberOfLines={1}>{name}</ThemedText>
      {subtitle && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={10} color="#D60202" />
          <ThemedText style={styles.verticalSubtitle}>{subtitle}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: Spacing.three,
    width: 200,
  },
  horizontalImage: {
    width: 48,
    height: 48,
    borderRadius: 2,
    marginRight: Spacing.two,
    backgroundColor: '#F3F4F6',
  },
  horizontalTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  horizontalSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D60202',
  },
  verticalContainer: {
    alignItems: 'center',
    marginRight: Spacing.four,
    width: 80,
  },
  verticalImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: Spacing.one,
    borderWidth: 2,
    borderColor: '#D60202',
    borderStyle: 'dashed',
  },
  verticalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verticalSubtitle: {
    fontSize: 11,
    color: '#0284C7', // Different blue/grey color based on preference, or just black. Let's use blue as standard or black
  },
});
