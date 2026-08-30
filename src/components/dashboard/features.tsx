import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Property, PropertyCard } from "./property-card";

interface FeaturesProps {
  listings: Property[];
}

export function Features({ listings }: FeaturesProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = useCallback(
    (delay: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % listings.length;

          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });

          return nextIndex;
        });
        // Set the next autoscroll to the default 3 seconds
        startAutoScroll(3000);
      }, delay);
    },
    [listings.length],
  );

  useEffect(() => {
    if (!listings || listings.length === 0) return;

    startAutoScroll(3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [listings.length, startAutoScroll]);

  // Keep currentIndex in sync when user manually swipes
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleInteraction = () => {
    // When user interacts, clear the timer and restart it with 8 seconds
    startAutoScroll(5000);
  };

  return (
    <FlatList
      ref={flatListRef}
      data={listings}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => <PropertyCard property={item} />}
      contentContainerStyle={styles.listContainer}
      onScrollBeginDrag={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onScrollEndDrag={handleInteraction}
      onMomentumScrollEnd={handleInteraction}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    // We remove the horizontal margins here because the items have marginRight,
    // and we can manage the padding in the parent or here if needed.
  },
});
