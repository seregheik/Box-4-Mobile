import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { useAddListingStore } from '@/store/add-listing.store';
import { Colors, Spacing } from '@/constants/theme';

export function Step2Location() {
  const { formData, updateFormData, nextStep, prevStep } = useAddListingStore();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={[styles.container, { paddingBottom: 120 }]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ThemedText style={styles.sectionTitle}>Location Information</ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Address *</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="e.g. 123 Main St, New York, NY"
          placeholderTextColor={theme.textSecondary}
          value={formData.address}
          onChangeText={(text) => updateFormData({ address: text })}
          multiline
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Latitude *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="e.g. 40.7128"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={formData.latitude}
            onChangeText={(text) => updateFormData({ latitude: text })}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Longitude *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="e.g. -74.0060"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={formData.longitude}
            onChangeText={(text) => updateFormData({ longitude: text })}
          />
        </View>
      </View>
      
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton, { borderColor: theme.buttonGrey }]} 
          onPress={prevStep}
        >
          <ThemedText style={{ color: theme.text }}>Back</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.tintBlue, flex: 2, marginLeft: Spacing.two }]} 
          onPress={nextStep}
          disabled={!formData.address || !formData.latitude || !formData.longitude}
        >
          <ThemedText style={styles.buttonText}>Next: Photos</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Spacing.four,
  },
  inputGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    marginBottom: Spacing.two,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
  },
  button: {
    padding: Spacing.four,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
