import { BackButton } from "@/components/back-button";
import { Skeleton } from "@/components/skeleton";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AgentService, Listing } from "@/services/agent.service";
import { useModalStore } from "@/store/modal.store";
import {
  AnimatedErrorIcon,
  AnimatedSuccessIcon,
} from "@/components/animated-status-icons";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

function DeleteConfirmationModalContent({
  listingTitle,
  listingId,
}: {
  listingTitle: string;
  listingId: string;
}) {
  const [inputText, setInputText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const handleDelete = async () => {
    if (inputText !== listingTitle) return;
    try {
      setIsDeleting(true);
      await AgentService.deleteListing(listingId);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <View style={{ marginTop: Spacing.two }}>
            <AnimatedSuccessIcon size={80} />
            <ThemedText
              style={{
                textAlign: "center",
                marginBottom: Spacing.five,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Successfully deleted.
            </ThemedText>
            <View style={{ flexDirection: "row" }}>
              <ThemedButton
                title="Finish"
                variant="primary"
                style={{ flex: 1 }}
                onPress={() => {
                  useModalStore.getState().hideModal();
                  router.back();
                }}
              />
            </View>
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
            <ThemedText
              style={{
                textAlign: "center",
                marginBottom: Spacing.five,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Property was not successfully deleted.
            </ThemedText>
            <View style={{ flexDirection: "row" }}>
              <ThemedButton
                title="Close"
                variant="outline"
                style={{ flex: 1, marginRight: Spacing.two }}
                onPress={() => useModalStore.getState().hideModal()}
              />
              <ThemedButton
                title="Retry"
                variant="primary"
                style={{ flex: 1 }}
                onPress={handleDelete}
              />
            </View>
          </View>
        ),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={{ marginTop: Spacing.two }}>
      <ThemedText style={{ marginBottom: Spacing.three }}>
        This action cannot be undone. To confirm, type the property name exactly
        as shown:
        <ThemedText style={{ fontWeight: "bold" }}> {listingTitle}</ThemedText>
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: theme.backgroundSelected,
            marginBottom: Spacing.four,
          },
        ]}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter property name"
        placeholderTextColor={theme.textSecondary}
      />

      <ThemedButton
        title="I acknowledge I want to delete this property"
        variant="primary"
        style={{ backgroundColor: Colors.light.tintRed }}
        onPress={handleDelete}
        disabled={inputText !== listingTitle || isDeleting}
        loading={isDeleting}
      />
    </View>
  );
}

export default function ListingDetailsScreen() {
  const { id, initialData } = useLocalSearchParams<{
    id: string;
    initialData?: string;
  }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!listing);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!listing) setLoading(true);
        const data = await AgentService.getListing(id);

        // Only update if there's a difference to avoid unnecessary re-renders
        if (JSON.stringify(data) !== JSON.stringify(listing)) {
          setListing(data);
        }
      } catch (error) {
        console.error("Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BackButton />
          <ThemedText style={styles.headerTitle}>Listing Details</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Skeleton height={250} borderRadius={0} />
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Skeleton height={32} width="60%" />
              <Skeleton height={24} width={60} borderRadius={8} />
            </View>
            <Skeleton
              height={28}
              width="40%"
              style={{ marginBottom: Spacing.one }}
            />
            <Skeleton
              height={20}
              width="30%"
              style={{ marginBottom: Spacing.four }}
            />

            <View style={styles.section}>
              <Skeleton
                height={24}
                width={100}
                style={{ marginBottom: Spacing.three }}
              />
              <Skeleton
                height={20}
                width="80%"
                style={{ marginBottom: Spacing.two }}
              />
              <Skeleton height={20} width="70%" />
            </View>

            <View style={styles.section}>
              <Skeleton
                height={24}
                width={100}
                style={{ marginBottom: Spacing.three }}
              />
              <View style={styles.statsGrid}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    height={80}
                    style={{ flex: 1, minWidth: "20%" }}
                    borderRadius={12}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Skeleton
                height={24}
                width={100}
                style={{ marginBottom: Spacing.three }}
              />
              <View style={styles.engagementRow}>
                {[1, 2].map((i) => (
                  <Skeleton
                    key={i}
                    height={100}
                    style={{ flex: 1 }}
                    borderRadius={12}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  if (!listing) {
    return (
      <ThemedView style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ThemedText>Listing not found</ThemedText>
      </ThemedView>
    );
  }

  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) => img.image)
      : listing.cover_photo
        ? [listing.cover_photo]
        : [];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton />
        <ThemedText style={styles.headerTitle}>Listing Details</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Images */}
        {images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={styles.coverImage}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.coverImage,
              styles.noImageContainer,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <Ionicons
              name="home-outline"
              size={48}
              color={theme.textSecondary}
            />
            <ThemedText themeColor="textSecondary">
              No images available
            </ThemedText>
          </View>
        )}

        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{listing.title}</ThemedText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    listing.status.toLowerCase() === "active"
                      ? "#7BC043"
                      : "#f5a623",
                },
              ]}
            >
              <ThemedText style={styles.statusText}>
                {listing.status.toUpperCase()}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.price, { color: theme.tintBlue }]}>
            N {listing.price.split(".")[0]}
          </ThemedText>
          <ThemedText style={styles.category}>
            {listing.category.toUpperCase()}
          </ThemedText>

          {/* Location */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Location</ThemedText>
            <View style={styles.row}>
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.textSecondary}
              />
              <ThemedText style={styles.locationText}>
                {listing.address}
              </ThemedText>
            </View>
            <View style={[styles.row, { marginTop: Spacing.two }]}>
              <Ionicons
                name="map-outline"
                size={20}
                color={theme.textSecondary}
              />
              <ThemedText style={styles.locationText}>
                Lat: {listing.latitude}, Lng: {listing.longitude}
              </ThemedText>
            </View>
          </View>

          {/* Rooms Stats */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Details</ThemedText>
            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons
                  name="bed-outline"
                  size={24}
                  color={theme.textSecondary}
                />
                <ThemedText style={styles.statValue}>
                  {listing.bedrooms}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Beds
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons
                  name="water-outline"
                  size={24}
                  color={theme.textSecondary}
                />
                <ThemedText style={styles.statValue}>
                  {listing.bathrooms}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Baths
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={theme.textSecondary}
                />
                <ThemedText style={styles.statValue}>
                  {listing.balconies}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Balconies
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={theme.textSecondary}
                />
                <ThemedText style={styles.statValue}>
                  {listing.total_rooms}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Total Rms
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Facilities */}
          {listing.facilities && listing.facilities.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Facilities</ThemedText>
              <View style={styles.facilitiesContainer}>
                {listing.facilities.map((facility, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.facilityChip,
                      { backgroundColor: theme.backgroundSelected },
                    ]}
                  >
                    <ThemedText style={styles.facilityText}>
                      {facility}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Engagement */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Engagement</ThemedText>
            <View style={styles.engagementRow}>
              <View
                style={[
                  styles.engagementBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons name="eye-outline" size={24} color={theme.tintBlue} />
                <ThemedText style={styles.engagementValue}>
                  {listing.views_count}
                </ThemedText>
                <ThemedText
                  style={styles.engagementLabel}
                  themeColor="textSecondary"
                >
                  Views
                </ThemedText>
              </View>
              <View
                style={[
                  styles.engagementBox,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={theme.tintBlue}
                />
                <ThemedText style={styles.engagementValue}>
                  {listing.inquiries_count}
                </ThemedText>
                <ThemedText
                  style={styles.engagementLabel}
                  themeColor="textSecondary"
                >
                  Inquiries
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Additional Info</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Published</ThemedText>
              <ThemedText style={styles.infoValue}>
                {listing.is_published ? "Yes" : "No"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Boosted</ThemedText>
              <ThemedText style={styles.infoValue}>
                {listing.is_boosted ? "Yes" : "No"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Featured</ThemedText>
              <ThemedText style={styles.infoValue}>
                {listing.is_featured ? "Yes" : "No"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Created At</ThemedText>
              <ThemedText style={styles.infoValue}>
                {new Date(listing.created_at).toLocaleDateString()}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Updated At</ThemedText>
              <ThemedText style={styles.infoValue}>
                {new Date(listing.updated_at).toLocaleDateString()}
              </ThemedText>
            </View>
          </View>

          <ThemedButton
            title="Delete Property"
            variant="outline"
            style={{
              marginTop: Spacing.five,
              borderColor: Colors.light.tintRed,
            }}
            textStyle={{ color: Colors.light.tintRed }}
            onPress={() => {
              useModalStore.getState().showModal({
                title: "Delete Property",
                showCancelButton: true,
                content: (
                  <DeleteConfirmationModalContent
                    listingTitle={listing.title}
                    listingId={listing.id}
                  />
                ),
              });
            }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: Spacing.six,
  },
  imageScroll: {
    width: width,
    height: 250,
  },
  coverImage: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.four,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: Spacing.one,
  },
  category: {
    fontSize: 14,
    color: "#888",
    marginBottom: Spacing.four,
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: Spacing.two,
    fontSize: 16,
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  statBox: {
    flex: 1,
    minWidth: "20%",
    padding: Spacing.three,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: Spacing.one,
  },
  statLabel: {
    fontSize: 12,
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  facilityChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 16,
    marginRight: Spacing.two,
    marginBottom: Spacing.two,
  },
  facilityText: {
    fontSize: 14,
  },
  engagementRow: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  engagementBox: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: 12,
    alignItems: "center",
  },
  engagementValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: Spacing.two,
  },
  engagementLabel: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#888",
  },
  infoLabel: {
    color: "#888",
    fontSize: 16,
  },
  infoValue: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.three,
    fontSize: 16,
  },
});
