import { Ionicons } from '@expo/vector-icons';
import { Appearance, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ThemeSwitcher() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  
  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newTheme);
  };

  return (
    <TouchableOpacity onPress={toggleTheme} style={[styles.button, { backgroundColor: theme.background, borderColor: theme.backgroundSelected }]}>
      <Ionicons 
        name={colorScheme === 'dark' ? 'sunny' : 'moon'} 
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
