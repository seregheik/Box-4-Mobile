import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAddListingStore } from '@/store/add-listing.store';
import { AgentService, Category } from '@/services/agent.service';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export function Step1BasicInfo() {
  const { formData, updateFormData, nextStep } = useAddListingStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await AgentService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find(c => c.name.toLowerCase() === formData.category.toLowerCase());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Title *</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="e.g. Beautiful 3 Bedroom House"
          placeholderTextColor={theme.textSecondary}
          value={formData.title}
          onChangeText={(text) => updateFormData({ title: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Category *</ThemedText>
        <TouchableOpacity 
          style={[styles.input, { borderColor: theme.backgroundSelected, justifyContent: 'center' }]} 
          onPress={() => setShowPicker(true)}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.tintBlue} />
          ) : (
            <ThemedText style={{ color: selectedCategory ? theme.text : theme.textSecondary }}>
              {selectedCategory ? selectedCategory.name : 'Select a category'}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Price *</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          placeholder="e.g. 150000"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(text) => updateFormData({ price: text })}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Bedrooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.bedrooms}
            onChangeText={(text) => updateFormData({ bedrooms: text })}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Bathrooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.bathrooms}
            onChangeText={(text) => updateFormData({ bathrooms: text })}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Balconies</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.balconies}
            onChangeText={(text) => updateFormData({ balconies: text })}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Total Rooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.total_rooms}
            onChangeText={(text) => updateFormData({ total_rooms: text })}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.tintBlue }]} 
        onPress={nextStep}
        disabled={!formData.title || !formData.category || !formData.price}
      >
        <ThemedText style={styles.buttonText}>Next: Location</ThemedText>
      </TouchableOpacity>

      {/* Category Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <ThemedText style={styles.modalTitle}>Select Category</ThemedText>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, { borderBottomColor: theme.backgroundSelected }]}
                  onPress={() => {
                    updateFormData({ category: item.name.toLowerCase() });
                    setShowPicker(false);
                  }}
                >
                  <ThemedText>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.buttonGrey }]}
              onPress={() => setShowPicker(false)}
            >
              <ThemedText style={{ color: colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  button: {
    padding: Spacing.four,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.four,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.three,
  },
  modalItem: {
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  cancelButton: {
    padding: Spacing.three,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
});
