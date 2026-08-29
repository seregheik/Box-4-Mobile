import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function UserLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tintRed,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarButton: ({ ref, ...props }) => (
          <Pressable
            {...props}
            ref={ref as any}
            android_ripple={{ color: "transparent" }}
          />
        ),
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          title: "Edit Profile",
        }}
      />
    </Tabs>
  );
}
