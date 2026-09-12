import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
}

export function SearchBar({ value, onChangeText, onSubmitEditing }: SearchBarProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color={Colors.light.tintRed} style={styles.searchIcon} />
        
        <TextInput 
          style={styles.searchInput}
          placeholder="What are you looking for?"
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          editable={false} // Since this is wrapped in a touchable on home screen
        />
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    marginBottom: Spacing.three,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.light.tintRed,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.tintRed,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
