import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { AdBanner } from "@/components/dashboard/ad-banner";
import { CategoryChips } from "@/components/dashboard/category-chips";
import { CircleItem } from "@/components/dashboard/circle-item";
import {
  FeaturedProperty
} from "@/components/dashboard/featured-card";
import { Features } from "@/components/dashboard/features";
import { Property, PropertyCard } from "@/components/dashboard/property-card";
import { SearchBar } from "@/components/dashboard/search-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { UserHeader } from "@/components/dashboard/user-header";

const CATEGORIES = ["All", "Luxury", "Residential", "Commercial"];

const FEATURED_LISTINGS: FeaturedProperty[] = [
  {
    id: "1",
    title: "Sky Dandelions Apartment",
    rating: 4.9,
    location: "Lekki, Lagos",
    price: "23,00000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Sky Dandelions Apartment",
    rating: 4.2,
    location: "Lekki, Lagos",
    price: "23,00000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    badge: "Villa",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Sky Dandelions Apartment",
    rating: 4.9,
    location: "Lekki, Lagos",
    price: "23,00000",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Sky Dandelions Apartment",
    rating: 4.2,
    location: "Lekki, Lagos",
    price: "23,00000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    badge: "Villa",
    isFavorite: true,
  },
];

const ADS = [
  {
    id: "1",
    title: "This is an Ad\nFor a client",
    subtitle: "Curated list of best value for money",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
  },
  {
    id: "2",
    title: "This is an Ad\nFor a client",
    subtitle: "Curated list of best value for money",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  },
];

const PROPERTIES: Property[] = [
  {
    id: "1",
    title: "4Bedroom apartment",
    address: "No 2 Ikorodu street, lagos",
    location: "Ikorodu, Lagos",
    price: "10,00000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
  },
  {
    id: "2",
    title: "3Bedroom bungalow",
    address: "45 Adeola Odeku, Victoria Island",
    location: "Victoria Island, Lagos",
    price: "8,50000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
];

const NEARBY_PROPERTIES: Property[] = [
  {
    id: "3",
    title: "5Bedroom duplex",
    address: "78 Lekki Phase 1, Lagos",
    location: "Lekki, Lagos",
    price: "15,00000",
    image: "https://images.unsplash.com/photo-1600607687931-cebf667114e2?w=400",
  },
  {
    id: "4",
    title: "1Bedroom studio",
    address: "3 Ahmadu Bello Way, Kaduna",
    location: "Kaduna",
    price: "3,00000",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
  },
];

const TOP_LOCATIONS = [
  {
    id: "1",
    name: "Benin",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=100",
  },
  {
    id: "2",
    name: "Abuja",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=100",
  },
  {
    id: "3",
    name: "Ibadan",
    image: "https://images.unsplash.com/photo-1543324021-0811e54e4fdb?w=100",
  },
];

const TOP_AGENTS = [
  { id: "1", name: "Amanda", image: "https://i.pravatar.cc/150?img=47" },
  { id: "2", name: "Anderson", image: "https://i.pravatar.cc/150?img=11" },
  { id: "3", name: "Samantha", image: "https://i.pravatar.cc/150?img=5" },
  { id: "4", name: "Andrew", image: "https://i.pravatar.cc/150?img=12" },
];

export default function UserHomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        <UserHeader />

        <View style={styles.greetingSection}>
          <ThemedText style={styles.greetingText}>
            Hey, <ThemedText style={styles.nameText}>Jonathan!</ThemedText>
          </ThemedText>
          <ThemedText style={styles.subGreetingText}>
            Let's start exploring
          </ThemedText>
        </View>

        <SearchBar />

        <CategoryChips
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Featured Listings */}
        <SectionHeader title="Featured Listings" actionText="view all" />
        <View style={styles.horizontalList}>
          <Features listings={FEATURED_LISTINGS} />
        </View>

        {/* Ads */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.horizontalList, { marginTop: Spacing.four }]}
        >
          {ADS.map((item) => (
            <AdBanner
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
            />
          ))}
        </ScrollView>

        {/* Properties */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.horizontalList, { marginTop: Spacing.four }]}
        >
          {PROPERTIES.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </ScrollView>

        {/* Top Locations */}
        <SectionHeader title="Top Locations" actionText="Explore" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {TOP_LOCATIONS.map((item) => (
            <CircleItem
              key={item.id}
              variant="horizontal"
              name={item.name}
              image={item.image}
            />
          ))}
        </ScrollView>

        {/* Top Agents */}
        <SectionHeader title="Top agents" actionText="Explore" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {TOP_AGENTS.map((item) => (
            <CircleItem
              key={item.id}
              variant="vertical"
              name={item.name}
              image={item.image}
            />
          ))}
        </ScrollView>

        {/* Explore nearby properties */}
        <SectionHeader title="Explore nearby properties" actionText="Explore" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {NEARBY_PROPERTIES.map((item) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: -Spacing.three,
    // backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
  },
  greetingSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  greetingText: {
    fontSize: 20,
    // color: "#1E293B",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D60202",
  },
  subGreetingText: {
    fontSize: 20,
    // color: "#1E293B",
  },
  horizontalList: {
    // marginHorizontal: Spacing.one,
    // paddingHorizontal: Spacing.four,
  },
});
