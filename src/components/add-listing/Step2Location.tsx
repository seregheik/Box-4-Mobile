import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { useAddListingStore } from "@/store/add-listing.store";
import { useAlertStore } from "@/store/alert.store";
import * as Location from "expo-location";
import { useState } from "react";
import { StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker } from "react-native-maps";

export function Step2Location() {
  const { formData, updateFormData, nextStep, prevStep } = useAddListingStore();
  const [isLocating, setIsLocating] = useState(false);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const getCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        useAlertStore
          .getState()
          .showAlert(
            "Permission Denied",
            "Location permission is required to use this feature.",
          );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      updateFormData({
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      });
    } catch (error) {
      console.error(error);
      useAlertStore
        .getState()
        .showAlert("Error", "Failed to get current location.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    updateFormData({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  };

  const currentLat = parseFloat(formData.latitude);
  const currentLng = parseFloat(formData.longitude);
  const hasValidCoordinates = !isNaN(currentLat) && !isNaN(currentLng);

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
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
          placeholder="e.g. 123 Main St, New York, NY"
          placeholderTextColor={theme.textSecondary}
          value={formData.address}
          onChangeText={(text) => updateFormData({ address: text })}
          multiline
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={
            hasValidCoordinates
              ? {
                  latitude: currentLat,
                  longitude: currentLng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : {
                  latitude: 40.7128,
                  longitude: -74.006,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
          }
          onPress={handleMapPress}
        >
          {hasValidCoordinates && (
            <Marker
              coordinate={{ latitude: currentLat, longitude: currentLng }}
              draggable
              onDragEnd={handleMapPress}
            />
          )}
        </MapView>
      </View>

      <ThemedButton
        title="📍 Use Current GPS Location"
        variant="secondary"
        style={styles.locationButton}
        textStyle={{ color: theme.tintBlue }}
        onPress={getCurrentLocation}
        disabled={isLocating}
        loading={isLocating}
      />

      <View style={styles.row}>
        <View
          style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}
        >
          <ThemedText style={styles.label}>Latitude *</ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
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
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
            placeholder="e.g. -74.0060"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={formData.longitude}
            onChangeText={(text) => updateFormData({ longitude: text })}
          />
        </View>
      </View>

      <View style={styles.actionRow}>
        <ThemedButton
          title="Back"
          variant="outline"
          style={[styles.button, { flex: 1 }]}
          onPress={prevStep}
        />

        <ThemedButton
          title="Next: Photos"
          variant="primary"
          style={[styles.button, { flex: 2, marginLeft: Spacing.two }]}
          onPress={nextStep}
          disabled={
            !formData.address || !formData.latitude || !formData.longitude
          }
        />
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
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: "#eee",
  },
  map: {
    flex: 1,
  },
  locationButton: {
    padding: Spacing.three,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: Spacing.four,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.five,
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
