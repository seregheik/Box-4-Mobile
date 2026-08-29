import { ThemedButton } from "@/components/themed-button";
import { ThemedModal } from "@/components/themed-modal";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { AgentService, Category } from "@/services/agent.service";
import { useAddListingStore } from "@/store/add-listing.store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Ionicons } from "@expo/vector-icons";

export function Step1BasicInfo() {
  const { formData, updateFormData, nextStep } = useAddListingStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [facilityInput, setFacilityInput] = useState("");
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const addFacility = () => {
    if (facilityInput.trim()) {
      updateFormData({
        facilities: [...formData.facilities, facilityInput.trim()],
      });
      setFacilityInput("");
    }
  };

  const removeFacility = (index: number) => {
    const newFacilities = [...formData.facilities];
    newFacilities.splice(index, 1);
    updateFormData({ facilities: newFacilities });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await AgentService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find(
    (c) => c.name.toLowerCase() === formData.category.toLowerCase(),
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, { paddingBottom: 120 }]}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Title *</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
          placeholder="e.g. Beautiful 3 Bedroom House"
          placeholderTextColor={theme.textSecondary}
          value={formData.title}
          onChangeText={(text) => updateFormData({ title: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Category *</ThemedText>
        <TouchableOpacity
          style={[
            styles.input,
            { borderColor: theme.backgroundSelected, justifyContent: "center" },
          ]}
          onPress={() => setShowPicker(true)}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.tintBlue} />
          ) : (
            <ThemedText
              style={{
                color: selectedCategory ? theme.text : theme.textSecondary,
              }}
            >
              {selectedCategory ? selectedCategory.name : "Select a category"}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Price *</ThemedText>
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
          placeholder="e.g. 150000"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(text) => updateFormData({ price: text })}
        />
      </View>

      <View style={styles.row}>
        <View
          style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}
        >
          <ThemedText style={styles.label}>Bedrooms</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
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
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.bathrooms}
            onChangeText={(text) => updateFormData({ bathrooms: text })}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View
          style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}
        >
          <ThemedText style={styles.label}>Balconies</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
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
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={formData.total_rooms}
            onChangeText={(text) => updateFormData({ total_rooms: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Facilities</ThemedText>
        <View style={styles.facilityInputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundSelected,
                flex: 1,
                marginRight: Spacing.two,
              },
            ]}
            placeholder="e.g. Parking lot, Garden"
            placeholderTextColor={theme.textSecondary}
            value={facilityInput}
            onChangeText={setFacilityInput}
            onSubmitEditing={addFacility}
          />
          <ThemedButton
            title="Add"
            variant="primary"
            style={styles.addButton}
            onPress={addFacility}
          />
        </View>
        <View style={styles.facilitiesContainer}>
          {formData.facilities.map((facility, index) => (
            <View
              key={index}
              style={[
                styles.facilityChip,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <ThemedText style={styles.facilityText}>{facility}</ThemedText>
              <TouchableOpacity
                onPress={() => removeFacility(index)}
                style={styles.facilityRemove}
              >
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <ThemedButton
        title="Next: Location"
        variant="primary"
        style={styles.button}
        onPress={nextStep}
        disabled={!formData.title || !formData.category || !formData.price}
      />

      {/* Category Picker Modal */}
      <ThemedModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        title="Select Category"
      >
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.modalItem,
                { borderBottomColor: theme.backgroundSelected },
              ]}
              onPress={() => {
                updateFormData({ category: item.name.toLowerCase() });
                setShowPicker(false);
              }}
            >
              <ThemedText>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </ThemedModal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    // paddingBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: Spacing.four,
  },
  inputGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    marginBottom: Spacing.two,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: Spacing.three,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  facilityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three + 2, // to match input height roughly
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing.two,
  },
  facilityChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    marginRight: Spacing.two,
    marginBottom: Spacing.two,
  },
  facilityText: {
    marginRight: Spacing.one,
    fontSize: 14,
  },
  facilityRemove: {
    marginLeft: 2,
  },
  button: {
    alignItems: "center",
    marginTop: Spacing.four,
    marginBottom: Spacing.five,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalItem: {
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
});
