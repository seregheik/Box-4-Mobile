import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

export interface FeaturedProperty {
  id: string;
  title: string;
  rating: number;
  location: string;
  price: string;
  image: string;
  badge?: string;
  isFavorite?: boolean;
}

interface FeaturedCardProps {
  property: FeaturedProperty;
}

export function FeaturedCard({ property }: FeaturedCardProps) {
  return (
    <View style={styles.container}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.image} />
        
        <View style={styles.favoriteBadge}>
          <Ionicons
            name={property.isFavorite ? "heart" : "heart-outline"}
            size={16}
            color="#ffffff"
          />
        </View>

        {property.badge && (
          <View style={styles.typeBadge}>
            <ThemedText style={styles.typeText}>{property.badge}</ThemedText>
          </View>
        )}
      </View>

      {/* Bottom Details Section */}
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>{property.title}</ThemedText>
        
        <View style={styles.infoRow}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <ThemedText style={styles.infoText}>{property.rating}</ThemedText>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-sharp" size={14} color="#64748B" />
          <ThemedText style={styles.infoText} numberOfLines={1}>{property.location}</ThemedText>
        </View>

        <ThemedText style={styles.price}>N {property.price}</ThemedText>
      </View>
    </View>
  );
}

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    marginRight: Spacing.three,
    overflow: "hidden", // ensures rounded corners for image on top
  },
  imageContainer: {
    width: "100%",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.tintRed,
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: Colors.light.tintRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#64748B",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.light.tintRed,
    marginTop: 2,
  },
});
