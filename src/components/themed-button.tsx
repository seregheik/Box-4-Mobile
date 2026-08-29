import { Colors, Spacing } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./themed-text";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

export interface ThemedButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export function ThemedButton({
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  children,
  ...rest
}: ThemedButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // Determine background and text colors based on variant
  let backgroundColor = theme.tintBlue;
  let textColor = "#fff";
  let borderColor = "transparent";
  let borderWidth = 0;

  switch (variant) {
    case "primary":
      backgroundColor = theme.tintBlue;
      textColor = "#fff";
      break;
    case "secondary":
      backgroundColor = theme.buttonGrey;
      textColor =
        colorScheme === "light" ? Colors.light.text : Colors.dark.text;
      break;
    case "outline":
      backgroundColor = "transparent";
      borderColor = theme.buttonGrey;
      borderWidth = 1;
      textColor = theme.text;
      break;
    case "danger":
      backgroundColor = theme.tintRed;
      textColor = "#fff";
      break;
  }

  // Adjust opacity for disabled state
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          opacity,
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : children ? (
        children
      ) : (
        <ThemedText style={[styles.text, { color: textColor }, textStyle]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.three,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
