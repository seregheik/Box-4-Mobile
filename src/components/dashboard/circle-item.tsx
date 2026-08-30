import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface CircleItemProps {
  name: string;
  image: string;
  variant: 'horizontal' | 'vertical'; // horizontal for Locations, vertical for Agents
}

export function CircleItem({ name, image, variant }: CircleItemProps) {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalContainer}>
        <Image source={{ uri: image }} style={styles.horizontalImage} />
        <ThemedText style={styles.horizontalText}>{name}</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalContainer}>
      <Image source={{ uri: image }} style={styles.verticalImage} />
      <ThemedText style={styles.verticalText}>{name}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 6,
    paddingRight: Spacing.four,
    borderRadius: 8,
    marginRight: Spacing.three,
  },
  horizontalImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: Spacing.two,
  },
  horizontalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  verticalContainer: {
    alignItems: 'center',
    marginRight: Spacing.four,
  },
  verticalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: Spacing.one,
  },
  verticalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
});
