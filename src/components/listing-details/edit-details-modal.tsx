import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Listing } from "@/services/agent.service";
import { useModalStore } from "@/store/modal.store";
import { Ionicons } from "@expo/vector-icons";
import { StatusModal } from "@/components/status-modal";

interface EditDetailsModalProps {
  listing: Listing;
  onUpdate: (updated: Listing) => void;
}

export function EditDetailsModal({ listing, onUpdate }: EditDetailsModalProps) {
  const theme = useTheme();
  
  const [bedrooms, setBedrooms] = useState(listing.bedrooms?.toString() || "0");
  const [bathrooms, setBathrooms] = useState(listing.bathrooms?.toString() || "0");
  const [balconies, setBalconies] = useState(listing.balconies?.toString() || "0");
  const [totalRooms, setTotalRooms] = useState(listing.total_rooms?.toString() || "0");
  const [facilities, setFacilities] = useState<string[]>(listing.facilities || []);
  const [facilityInput, setFacilityInput] = useState("");
  
  const [isUpdating, setIsUpdating] = useState(false);

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFacilities([...facilities, facilityInput.trim()]);
      setFacilityInput("");
    }
  };

  const removeFacility = (index: number) => {
    const newFacilities = [...facilities];
    newFacilities.splice(index, 1);
    setFacilities(newFacilities);
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    try {
      setIsUpdating(true);
      const updatedListing = await AgentService.updateListing(listing.id, { 
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        total_rooms: Number(totalRooms),
        facilities
      });
      onUpdate(updatedListing);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <StatusModal
            status="success"
            message="Details updated successfully."
            onClose={() => useModalStore.getState().hideModal()}
          />
        ),
      });
    } catch (error) {
      console.error(error);
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <StatusModal
            status="error"
            message="Failed to update details."
            onClose={() => useModalStore.getState().hideModal()}
          />
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = 
    bedrooms !== (listing.bedrooms?.toString() || "0") ||
    bathrooms !== (listing.bathrooms?.toString() || "0") ||
    balconies !== (listing.balconies?.toString() || "0") ||
    totalRooms !== (listing.total_rooms?.toString() || "0") ||
    JSON.stringify(facilities) !== JSON.stringify(listing.facilities || []);

  return (
    <View style={{ flexShrink: 1, marginTop: Spacing.two }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
        <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Bedrooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={bedrooms}
            keyboardType="number-pad"
            onChangeText={setBedrooms}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Bathrooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={bathrooms}
            keyboardType="number-pad"
            onChangeText={setBathrooms}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Balconies</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={balconies}
            keyboardType="number-pad"
            onChangeText={setBalconies}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Total Rooms</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={totalRooms}
            keyboardType="number-pad"
            onChangeText={setTotalRooms}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Facilities</ThemedText>
        <View style={styles.facilityInputContainer}>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected, flex: 1, marginRight: Spacing.two },
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
          {facilities.map((facility, index) => (
            <View key={index} style={[styles.facilityChip, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.facilityText}>{facility}</ThemedText>
              <TouchableOpacity onPress={() => removeFacility(index)} style={styles.facilityRemove}>
                <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
      
      <ThemedButton
        title="Save Changes"
        variant="primary"
        onPress={handleUpdate}
        disabled={!hasChanges || isUpdating}
        loading={isUpdating}
        style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    marginBottom: Spacing.two,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
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
    paddingVertical: Spacing.three + 2, 
    borderRadius: 8,
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
  resultText: {
    textAlign: "center",
    marginBottom: Spacing.five,
    fontSize: 18,
    fontWeight: "bold",
  }
});
