import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionText, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
      
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Ionicons name="arrow-forward" size={20} color="#D60202" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.tintRed,
  },
});
