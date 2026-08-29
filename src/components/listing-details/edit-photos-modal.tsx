import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Listing } from "@/services/agent.service";
import { useModalStore } from "@/store/modal.store";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedSuccessIcon, AnimatedErrorIcon } from "@/components/animated-status-icons";
import * as ImagePicker from "expo-image-picker";

interface EditPhotosModalProps {
  listing: Listing;
  onUpdate: (updated: Listing) => void;
}

export function EditPhotosModal({ listing, onUpdate }: EditPhotosModalProps) {
  const theme = useTheme();
  
  const initialPhotos = listing.images && listing.images.length > 0 
    ? listing.images.map(img => img.image) 
    : (listing.cover_photo ? [listing.cover_photo] : []);
    
  let initialCoverIndex = 0;
  if (listing.cover_photo) {
    const idx = initialPhotos.findIndex(p => p === listing.cover_photo || p.endsWith(listing.cover_photo));
    if (idx !== -1) initialCoverIndex = idx;
  }
  
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(initialCoverIndex);
  const [isUpdating, setIsUpdating] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    if (coverPhotoIndex === index) {
      setCoverPhotoIndex(0);
    } else if (coverPhotoIndex > index) {
      setCoverPhotoIndex(coverPhotoIndex - 1);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const imageUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const photoUri = photos[i];
        
        // If it's a new local photo, upload it
        if (!photoUri.startsWith("http")) {
          const filename = photoUri.split("/").pop() || `photo_${i}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          const uploadData = new FormData();
          uploadData.append("file", {
            uri: photoUri,
            name: filename,
            type,
          } as any);

          const uploadResult = await AgentService.uploadMedia(uploadData);
          imageUrls.push(uploadResult.relative_url);
        } else {
          // Existing photo
          imageUrls.push(photoUri);
        }
      }

      const updatedListing = await AgentService.updateListing(listing.id, { 
        image_urls: imageUrls,
        cover_photo_url: imageUrls.length > 0 ? imageUrls[coverPhotoIndex] : ""
      });
      
      onUpdate(updatedListing);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <View style={{ marginTop: Spacing.two }}>
            <AnimatedSuccessIcon size={80} />
            <ThemedText style={styles.resultText}>Photos updated successfully.</ThemedText>
            <ThemedButton
              title="Close"
              variant="primary"
              onPress={() => useModalStore.getState().hideModal()}
            />
          </View>
        ),
      });
    } catch (error) {
      console.error(error);
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <View style={{ marginTop: Spacing.two }}>
            <AnimatedErrorIcon size={80} />
            <ThemedText style={styles.resultText}>Failed to update photos.</ThemedText>
            <ThemedButton
              title="Close"
              variant="outline"
              onPress={() => useModalStore.getState().hideModal()}
            />
          </View>
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = JSON.stringify(photos) !== JSON.stringify(initialPhotos) || coverPhotoIndex !== initialCoverIndex;

  return (
    <View style={{ flexShrink: 1, marginTop: Spacing.two }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
        <TouchableOpacity
        style={[
          styles.uploadButton,
          { borderColor: theme.tintBlue, backgroundColor: theme.backgroundElement },
        ]}
        onPress={pickImage}
      >
        <Ionicons name="camera-outline" size={32} color={theme.tintBlue} />
        <ThemedText style={{ color: theme.tintBlue, marginTop: Spacing.two }}>
          Add Photos
        </ThemedText>
      </TouchableOpacity>

      {photos.length > 0 && (
        <ThemedText style={styles.instructionText}>
          Tap on a photo to set it as the cover image.
        </ThemedText>
      )}

      <View style={styles.photosGrid}>
        {photos.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.photoContainer,
              coverPhotoIndex === index && {
                borderWidth: 2,
                borderColor: theme.tintBlue,
                borderRadius: 10,
              },
            ]}
            onPress={() => setCoverPhotoIndex(index)}
            activeOpacity={0.8}
          >
            <Image source={{ uri }} style={styles.photo} />
            {coverPhotoIndex === index && (
              <View style={styles.coverBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <ThemedText style={styles.coverBadgeText}>Cover</ThemedText>
              </View>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={Colors.light.tintRed}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
      
      <ThemedButton
        title="Save Changes"
        variant="primary"
        onPress={handleUpdate}
        disabled={!hasChanges || photos.length === 0 || isUpdating}
        loading={isUpdating}
        style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: Spacing.five,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing.one,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: Spacing.two,
    textAlign: "center",
  },
  photoContainer: {
    width: "33.33%",
    padding: Spacing.one,
    aspectRatio: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  coverBadge: {
    position: "absolute",
    bottom: Spacing.one + 4,
    left: Spacing.one + 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: "#fff",
    fontSize: 10,
    marginLeft: 2,
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.half,
    right: Spacing.half,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  resultText: {
    textAlign: "center",
    marginBottom: Spacing.five,
    fontSize: 18,
    fontWeight: "bold",
  }
});
