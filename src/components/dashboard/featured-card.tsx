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
      {/* Left Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.image} />

        {property.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={14} color="#ffffff" />
          </View>
        )}

        {property.badge && (
          <View style={styles.typeBadge}>
            <ThemedText style={styles.typeText}>{property.badge}</ThemedText>
          </View>
        )}
      </View>

      {/* Right Details Section */}
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {property.title}
        </ThemedText>

        <View style={styles.infoRow}>
          <Ionicons name="star" size={12} color="#FBBF24" />
          <ThemedText style={styles.infoText}>{property.rating}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-sharp" size={12} color="#64748B" />
          <ThemedText style={styles.infoText} numberOfLines={1}>
            {property.location}
          </ThemedText>
        </View>

        <View style={{ flex: 1 }} />

        <ThemedText style={styles.price}>₦ {property.price}</ThemedText>
      </View>
    </View>
  );
}

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: width - 32, // Screen width minus horizontal padding
    height: 140,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: Spacing.two,
    marginRight: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    width: 120,
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
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
    flex: 1,
    padding: Spacing.two,
    paddingLeft: Spacing.three,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    // color: "#1E293B",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    // color: "#64748B",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.tintRed,
  },
});
