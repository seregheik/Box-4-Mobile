import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';

export function ThemeSwitcher() {
  const colorScheme = useColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const theme = useTheme();
  
  const effectiveTheme = themePreference || colorScheme;
  
  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newTheme);
  };

  return (
    <TouchableOpacity onPress={toggleTheme} style={[styles.button, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
      <Ionicons 
        name={effectiveTheme === 'dark' ? 'sunny' : 'moon'} 
        size={20} 
        color={theme.text} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  }
});
