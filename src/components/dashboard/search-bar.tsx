import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
      
      <TextInput 
        style={styles.input}
        placeholder="What are you looking for?"
        placeholderTextColor="#94A3B8"
      />
      
      <View style={styles.divider} />

      <TouchableOpacity style={styles.micButton}>
        <Ionicons name="mic-outline" size={20} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: Spacing.three,
    height: 44,
    marginVertical: Spacing.three,
  },
  searchIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: Spacing.two,
  },
  micButton: {
    padding: Spacing.one,
  },
});
