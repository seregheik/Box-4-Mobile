import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { ColorSchemeName } from 'react-native';

interface AppState {
  themePreference: ColorSchemeName;
  setThemePreference: (theme: ColorSchemeName) => void;
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themePreference: 'light',
      setThemePreference: (theme) => set({ themePreference: theme }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
