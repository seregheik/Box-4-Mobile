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
                  backgroundColor: isActive
                    ? colors.tintRed
                    : colors.backgroundElement,
                },
              ]}
            >
            <ThemedText
              style={[
                styles.text,
                { color: isActive ? "#ffffff" : colors.text },
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
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});
