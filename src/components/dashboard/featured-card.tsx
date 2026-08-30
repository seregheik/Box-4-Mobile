import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

export interface FeaturedProperty {
  id: string;
  title: string;
  rating: number;
  reviewsCount: number;
  location: string;
  price: string;
  priceUnit?: string;
  image: string;
  badge?: string;
  isFavorite?: boolean;
  bedrooms: number;
  bathrooms: number;
  size: number;
}

interface FeaturedCardProps {
  property: FeaturedProperty;
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={14} color="#F59E0B" />
      ))}
      {hasHalfStar && <Ionicons name="star-half" size={14} color="#F59E0B" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#F59E0B" />
      ))}
      <ThemedText style={[styles.infoText, { marginLeft: 4, fontWeight: 'bold' }]}>{rating}</ThemedText>
    </View>
  );
}

export function FeaturedCard({ property }: FeaturedCardProps) {
  return (
    <View style={styles.container}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.image }} 
          style={styles.image} 
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }}
        />
        
        {property.badge && (
          <View style={styles.typeBadge}>
            <ThemedText style={styles.typeText}>{property.badge.toUpperCase()}</ThemedText>
          </View>
        )}

        <View style={styles.favoriteBadge}>
          <Ionicons
            name={property.isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={property.isFavorite ? Colors.light.tintRed : "#1E293B"}
          />
        </View>
      </View>

      {/* Bottom Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.priceRow}>
          <ThemedText style={styles.price}>${property.price}</ThemedText>
          {property.priceUnit && (
            <ThemedText style={styles.priceUnit}>{property.priceUnit}</ThemedText>
          )}
        </View>

        <ThemedText style={styles.title} numberOfLines={1}>{property.title}</ThemedText>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#94A3B8" />
          <ThemedText style={styles.infoText} numberOfLines={1}>{property.location}</ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.footerRow}>
          <View style={styles.ratingContainer}>
            {renderStars(property.rating)}
            <ThemedText style={styles.reviewsCount}>({property.reviewsCount})</ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="bed-outline" size={14} color="#64748B" />
              <ThemedText style={styles.statText}>{property.bedrooms}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="water-outline" size={14} color="#64748B" />
              <ThemedText style={styles.statText}>{property.bathrooms}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="square-outline" size={12} color="#64748B" />
              <ThemedText style={styles.statText}>{property.size}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: 260, // Wider than the total height
    backgroundColor: "#ffffff",
    borderRadius: 2,
    marginRight: Spacing.four,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 120, // Drastically reduced
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.light.tintRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  typeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailsContainer: {
    padding: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 2,
  },
  price: {
    fontSize: 20, // Reduced from 24
    fontWeight: "bold",
    color: Colors.light.tintRed,
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#9CA3AF",
    marginLeft: 4,
  },
  title: {
    fontSize: 15, // Reduced from 18
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12, // Reduced from 14
    color: "#9CA3AF",
    marginLeft: 6,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewsCount: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1F2937",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
