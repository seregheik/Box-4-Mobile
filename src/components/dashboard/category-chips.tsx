import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

interface CategoryChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryChips({
  categories,
  activeCategory,
  onSelect,
}: CategoryChipsProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? "#D60202" : "#ffffff",
                borderColor: isActive ? "#D60202" : "#E5E7EB",
              },
            ]}
          >
            <ThemedText
              style={[
                styles.text,
                { color: isActive ? "#ffffff" : "#64748B" },
              ]}
            >
              {category}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
});
