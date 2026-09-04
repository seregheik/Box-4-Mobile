import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

interface AppState {
  themePreference: ColorSchemeName;
  setThemePreference: (theme: ColorSchemeName) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: 'light',
      setThemePreference: (theme) => set({ themePreference: theme }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
