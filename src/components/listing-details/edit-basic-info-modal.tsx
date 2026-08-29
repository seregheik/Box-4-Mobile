import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Keyboard } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Category, Listing } from "@/services/agent.service";
import { useModalStore } from "@/store/modal.store";
import { Ionicons } from "@expo/vector-icons";
import { StatusModal } from "@/components/status-modal";

interface EditBasicInfoModalProps {
  listing: Listing;
  onUpdate: (updated: Listing) => void;
}

export function EditBasicInfoModal({ listing, onUpdate }: EditBasicInfoModalProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(listing.price.split('.')[0]); // strip decimal for input
  const [category, setCategory] = useState(listing.category.toLowerCase());
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCats(true);
        const data = await AgentService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategory = categories.find(c => c.name.toLowerCase() === category);

  const handleUpdate = async () => {
    Keyboard.dismiss();
    try {
      setIsUpdating(true);
      const updatedListing = await AgentService.updateListing(listing.id, { 
        title, 
        price, 
        category 
      });
      onUpdate(updatedListing);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <StatusModal
            status="success"
            message="Basic info updated successfully."
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
            message="Failed to update basic info."
            onClose={() => useModalStore.getState().hideModal()}
          />
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = title !== listing.title || price !== listing.price.split('.')[0] || category !== listing.category.toLowerCase();

  return (
    <View style={{ flexShrink: 1, marginTop: Spacing.two }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
        <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Price</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <TouchableOpacity
          style={[styles.input, { borderColor: theme.backgroundSelected, justifyContent: "center" }]}
          onPress={() => {
            Keyboard.dismiss();
            setShowCategoryDropdown(!showCategoryDropdown);
          }}
        >
          {loadingCats ? (
            <ActivityIndicator size="small" color={theme.tintBlue} />
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText style={{ color: selectedCategory ? theme.text : theme.textSecondary }}>
                {selectedCategory ? selectedCategory.name : "Select a category"}
              </ThemedText>
              <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color={theme.textSecondary} />
            </View>
          )}
        </TouchableOpacity>
        
        {showCategoryDropdown && categories.length > 0 && (
          <View style={[styles.dropdown, { borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement }]}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.dropdownItem, 
                  index < categories.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.backgroundSelected }
                ]}
                onPress={() => {
                  setCategory(cat.name.toLowerCase());
                  setShowCategoryDropdown(false);
                }}
              >
                <ThemedText>{cat.name}</ThemedText>
                {category === cat.name.toLowerCase() && (
                  <Ionicons name="checkmark" size={20} color={theme.tintBlue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
      
      <ThemedButton
        title="Save Changes"
        variant="primary"
        onPress={handleUpdate}
        disabled={!hasChanges || !title || !price || !category || isUpdating}
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
  dropdown: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    marginTop: -4,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
  },
  resultText: {
    textAlign: "center",
    marginBottom: Spacing.five,
    fontSize: 18,
    fontWeight: "bold",
  }
});
