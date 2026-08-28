import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { AgentService } from "@/services/agent.service";
import { useAddListingStore } from "@/store/add-listing.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export function Step3Photos() {
  const { formData, photos, setPhotos, prevStep, resetForm } =
    useAddListingStore();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [loading, setLoading] = useState(false);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
  const router = useRouter();

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

  const submitForm = async () => {
    try {
      setLoading(true);
      const imageUrls: string[] = [];

      // Upload photos sequentially
      for (let i = 0; i < photos.length; i++) {
        const photoUri = photos[i];
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
      }

      // Build JSON payload
      const payload = {
        ...formData,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        balconies: formData.balconies ? Number(formData.balconies) : 0,
        total_rooms: formData.total_rooms ? Number(formData.total_rooms) : 0,
        status: "active",
        is_published: true,
        cover_photo_url: imageUrls.length > 0 ? imageUrls[coverPhotoIndex] : "",
        image_urls: imageUrls,
        image_ids: [],
      };

      console.log("Submitting payload:", payload);
      await AgentService.createListing(payload);
      Alert.alert("Success", "Listing created successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Failed to create listing", error.response?.data || error);
      Alert.alert("Error", "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.sectionTitle}>Photos</ThemedText>

      <TouchableOpacity
        style={[
          styles.uploadButton,
          {
            borderColor: theme.tintBlue,
            backgroundColor: theme.backgroundElement,
          },
        ]}
        onPress={pickImage}
      >
        <Ionicons name="camera-outline" size={32} color={theme.tintBlue} />
        <ThemedText style={{ color: theme.tintBlue, marginTop: Spacing.two }}>
          Upload Photos
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
            style={[styles.photoContainer, coverPhotoIndex === index && { borderWidth: 2, borderColor: theme.tintBlue, borderRadius: 10 }]}
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

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { borderColor: theme.buttonGrey },
          ]}
          onPress={prevStep}
          disabled={loading}
        >
          <ThemedText style={{ color: theme.text }}>Back</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.tintBlue,
              flex: 2,
              marginLeft: Spacing.two,
            },
          ]}
          onPress={submitForm}
          disabled={loading || photos.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Submit Listing</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: Spacing.four,
  },
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
  actionRow: {
    flexDirection: "row",
    marginTop: Spacing.five,
  },
  button: {
    padding: Spacing.four,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
