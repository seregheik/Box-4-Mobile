/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore } from '@/store/app-store';

export function useTheme() {
  const scheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);
  
  const effectiveScheme = themePreference || scheme;
  const theme = effectiveScheme === 'unspecified' ? 'light' : effectiveScheme;

  return Colors[theme];
}
