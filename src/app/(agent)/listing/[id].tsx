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
import { StatusModal } from "@/components/status-modal";
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
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EditBasicInfoModal } from "@/components/listing-details/edit-basic-info-modal";
import { EditDetailsModal } from "@/components/listing-details/edit-details-modal";
import { EditLocationModal } from "@/components/listing-details/edit-location-modal";
import { EditPhotosModal } from "@/components/listing-details/edit-photos-modal";

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
          <StatusModal
            status="success"
            message="Successfully deleted."
            closeText="Finish"
            onClose={() => {
              useModalStore.getState().hideModal();
              router.back();
            }}
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
            message="Property was not successfully deleted."
            onClose={() => useModalStore.getState().hideModal()}
            onRetry={handleDelete}
          />
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

function UpdatePropertyModalContent({ listing, onUpdate }: { listing: Listing, onUpdate: (updated: Listing) => void }) {
  const [status, setStatus] = useState(listing.status.toLowerCase());
  const [isUpdating, setIsUpdating] = useState(false);
  const theme = useTheme();

  const statuses = [
    { label: "Active", value: "active" },
    { label: "Pending Approval", value: "pending" },
    { label: "Sold", value: "sold" },
    { label: "Rejected", value: "rejected" },
  ];

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const updatedListing = await AgentService.updateListing(listing.id, { status });
      onUpdate(updatedListing);
      
      useModalStore.getState().showModal({
        showCancelButton: false,
        content: (
          <StatusModal
            status="success"
            message="Property updated successfully."
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
            message="Failed to update property."
            onClose={() => useModalStore.getState().hideModal()}
          />
        ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={{ flexShrink: 1, marginTop: Spacing.two }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
      
      <View style={{ marginBottom: Spacing.five }}>
        {statuses.map(s => (
          <TouchableOpacity
            key={s.value}
            onPress={() => setStatus(s.value)}
            style={{
              padding: Spacing.three,
              borderWidth: 1,
              borderColor: status === s.value ? theme.tintBlue : theme.backgroundSelected,
              backgroundColor: status === s.value ? `${theme.tintBlue}15` : theme.backgroundElement,
              borderRadius: 8,
              marginBottom: Spacing.two,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <ThemedText style={{ fontWeight: status === s.value ? 'bold' : 'normal', color: status === s.value ? theme.tintBlue : theme.text }}>
              {s.label}
            </ThemedText>
            {status === s.value && <Ionicons name="checkmark-circle" size={20} color={theme.tintBlue} />}
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
      
      <ThemedButton
        title="Update Property"
        variant="primary"
        onPress={handleUpdate}
        disabled={status === listing.status.toLowerCase() || isUpdating}
        loading={isUpdating}
        style={{ marginTop: Spacing.four, marginBottom: Spacing.two }}
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
          <View style={styles.editButtonPlaceholder} />
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
        <View style={styles.editButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Images */}
        <View style={{ position: 'relative' }}>
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
          
          <TouchableOpacity 
            style={styles.floatingEditPhotosButton}
            onPress={() => {
              useModalStore.getState().showModal({
                title: "Update Photos",
                content: <EditPhotosModal listing={listing} onUpdate={setListing} />,
                showCancelButton: true
              });
            }}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{listing.title}</ThemedText>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  useModalStore.getState().showModal({
                    title: "Update Status",
                    showCancelButton: true,
                    content: <UpdatePropertyModalContent listing={listing} onUpdate={(updated) => setListing(updated)} />
                  });
                }}
                style={{ marginRight: Spacing.two }}
              >
                <ThemedText style={{ fontSize: 12, color: theme.tintBlue, fontWeight: 'bold' }}>
                  CHANGE
                </ThemedText>
              </TouchableOpacity>
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
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText style={[styles.price, { color: theme.tintBlue }]}>
                N {listing.price.split(".")[0]}
              </ThemedText>
              <ThemedText style={styles.category}>
                {listing.category.toUpperCase()}
              </ThemedText>
            </View>
            <TouchableOpacity 
              onPress={() => useModalStore.getState().showModal({
                title: "Update Basic Info",
                content: <EditBasicInfoModal listing={listing} onUpdate={setListing} />,
                showCancelButton: true
              })}
              style={styles.sectionEditButton}
            >
              <Ionicons name="pencil" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Location</ThemedText>
              <TouchableOpacity onPress={() => useModalStore.getState().showModal({
                title: "Update Location",
                content: <EditLocationModal listing={listing} onUpdate={setListing} />,
                showCancelButton: true
              })}>
                <Ionicons name="pencil" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
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
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Details</ThemedText>
              <TouchableOpacity onPress={() => useModalStore.getState().showModal({
                title: "Update Details",
                content: <EditDetailsModal listing={listing} onUpdate={setListing} />,
                showCancelButton: true
              })}>
                <Ionicons name="pencil" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.minimalStatsGrid}>
              <View style={styles.minimalStatItem}>
                <View style={styles.minimalStatIcon}>
                  <Ionicons name="bed-outline" size={20} color={theme.textSecondary} />
                </View>
                <ThemedText style={styles.minimalStatValue}>
                  {listing.bedrooms} <ThemedText themeColor="textSecondary" style={styles.minimalStatLabel}>Beds</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.minimalStatItem}>
                <View style={styles.minimalStatIcon}>
                  <Ionicons name="water-outline" size={20} color={theme.textSecondary} />
                </View>
                <ThemedText style={styles.minimalStatValue}>
                  {listing.bathrooms} <ThemedText themeColor="textSecondary" style={styles.minimalStatLabel}>Baths</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.minimalStatItem}>
                <View style={styles.minimalStatIcon}>
                  <Ionicons name="business-outline" size={20} color={theme.textSecondary} />
                </View>
                <ThemedText style={styles.minimalStatValue}>
                  {listing.balconies} <ThemedText themeColor="textSecondary" style={styles.minimalStatLabel}>Balconies</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.minimalStatItem}>
                <View style={styles.minimalStatIcon}>
                  <Ionicons name="home-outline" size={20} color={theme.textSecondary} />
                </View>
                <ThemedText style={styles.minimalStatValue}>
                  {listing.total_rooms} <ThemedText themeColor="textSecondary" style={styles.minimalStatLabel}>Total Rooms</ThemedText>
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Facilities */}
          {listing.facilities && listing.facilities.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Facilities</ThemedText>
                <TouchableOpacity onPress={() => useModalStore.getState().showModal({
                  title: "Update Details",
                  content: <EditDetailsModal listing={listing} onUpdate={setListing} />,
                  showCancelButton: true
                })}>
                  <Ionicons name="pencil" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
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
            <View style={styles.minimalEngagementRow}>
              <View style={styles.minimalEngagementItem}>
                <Ionicons name="eye-outline" size={22} color={theme.tintBlue} />
                <ThemedText style={styles.minimalEngagementValue}>
                  {listing.views_count} <ThemedText themeColor="textSecondary" style={styles.minimalEngagementLabel}>Views</ThemedText>
                </ThemedText>
              </View>
              <View style={styles.minimalEngagementDivider} />
              <View style={styles.minimalEngagementItem}>
                <Ionicons name="chatbubble-outline" size={22} color={theme.tintBlue} />
                <ThemedText style={styles.minimalEngagementValue}>
                  {listing.inquiries_count} <ThemedText themeColor="textSecondary" style={styles.minimalEngagementLabel}>Inquiries</ThemedText>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
  },
  editButtonPlaceholder: {
    width: 40,
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
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  sectionEditButton: {
    padding: Spacing.two,
    borderRadius: 8,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  floatingEditPhotosButton: {
    position: 'absolute',
    top: Spacing.four,
    right: Spacing.four,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.three,
    borderRadius: 20,
    zIndex: 10,
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
  minimalStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: Spacing.four,
    columnGap: Spacing.four,
    marginTop: Spacing.one,
  },
  minimalStatItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "45%",
  },
  minimalStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(128,128,128,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.three,
  },
  minimalStatValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  minimalStatLabel: {
    fontSize: 14,
    fontWeight: "normal",
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
  minimalEngagementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.two,
  },
  minimalEngagementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  minimalEngagementValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: Spacing.two,
  },
  minimalEngagementLabel: {
    fontSize: 16,
    fontWeight: "normal",
  },
  minimalEngagementDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(128,128,128,0.3)",
    marginHorizontal: Spacing.five,
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
