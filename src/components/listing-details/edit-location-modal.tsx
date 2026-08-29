import React, { useState } from "react";
import { View, StyleSheet, TextInput, Keyboard, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Listing } from "@/services/agent.service";
import { useModalStore } from "@/store/modal.store";
import { useAlertStore } from "@/store/alert.store";
import { AnimatedSuccessIcon, AnimatedErrorIcon } from "@/components/animated-status-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

interface EditLocationModalProps {
  listing: Listing;
  onUpdate: (updated: Listing) => void;
}

export function EditLocationModal({ listing, onUpdate }: EditLocationModalProps) {
  const theme = useTheme();
  const [address, setAddress] = useState(listing.address);
  const [latitude, setLatitude] = useState(listing.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(listing.longitude?.toString() || "");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
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
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    try {
      setIsUpdating(true);
      const updatedListing = await AgentService.updateListing(listing.id, { 
        address,
        latitude,
        longitude
      });
      onUpdate(updatedListing);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <View style={{ marginTop: Spacing.two }}>
            <AnimatedSuccessIcon size={80} />
            <ThemedText style={styles.resultText}>Location updated successfully.</ThemedText>
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
            <ThemedText style={styles.resultText}>Failed to update location.</ThemedText>
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

  const currentLat = parseFloat(latitude);
  const currentLng = parseFloat(longitude);
  const hasValidCoordinates = !isNaN(currentLat) && !isNaN(currentLng);

  const hasChanges = 
    address !== listing.address ||
    latitude !== (listing.latitude?.toString() || "") ||
    longitude !== (listing.longitude?.toString() || "");

  return (
    <ScrollView style={{ marginTop: Spacing.two }} keyboardShouldPersistTaps="handled">
      <ThemedText style={{ marginBottom: Spacing.three, fontWeight: 'bold' }}>
        Edit Location
      </ThemedText>
      
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Address *</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          value={address}
          onChangeText={setAddress}
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
        onPress={() => {
          Keyboard.dismiss();
          getCurrentLocation();
        }}
        disabled={isLocating}
        loading={isLocating}
      />

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.two }]}>
          <ThemedText style={styles.label}>Latitude *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={latitude}
            keyboardType="numeric"
            onChangeText={setLatitude}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <ThemedText style={styles.label}>Longitude *</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={longitude}
            keyboardType="numeric"
            onChangeText={setLongitude}
          />
        </View>
      </View>
      
      <ThemedButton
        title="Save Changes"
        variant="primary"
        onPress={handleUpdate}
        disabled={!hasChanges || !address || !latitude || !longitude || isUpdating}
        loading={isUpdating}
        style={{ marginTop: Spacing.two }}
      />
    </ScrollView>
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
  resultText: {
    textAlign: "center",
    marginBottom: Spacing.five,
    fontSize: 18,
    fontWeight: "bold",
  }
});
