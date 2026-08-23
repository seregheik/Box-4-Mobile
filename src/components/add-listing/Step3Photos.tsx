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
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const data = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          data.append(key, String(value));
        }
      });

      // Append photos
      photos.forEach((photoUri, index) => {
        const filename = photoUri.split("/").pop() || `photo_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        // React Native FormData format for files
        data.append("uploaded_images", {
          uri: photoUri,
          name: filename,
          type,
        } as any);
      });
      console.log(data);
      await AgentService.createListing(data);
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

      <View style={styles.photosGrid}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri }} style={styles.photo} />
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
          </View>
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
