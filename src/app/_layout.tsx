import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Appearance } from 'react-native';
import { Slot } from 'expo-router';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/context/auth-context';
import { GlobalAlert } from '@/components/global-alert';
import { GlobalModal } from '@/components/global-modal';
import { useAppStore } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);

  useEffect(() => {
    if (themePreference) {
      Appearance.setColorScheme(themePreference);
    }
  }, [themePreference]);

  const effectiveTheme = themePreference || colorScheme;

  return (
    <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Slot />
        <GlobalAlert />
        <GlobalModal />
      </AuthProvider>
    </ThemeProvider>
  );
}
