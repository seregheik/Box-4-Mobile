import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface AdBannerProps {
  title: string;
  subtitle: string;
  image: string;
}

export function AdBanner({ title, subtitle, image }: AdBannerProps) {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: image }} 
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          </View>

          <TouchableOpacity style={styles.button}>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 160,
    marginRight: Spacing.three,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: Spacing.three,
  },
  content: {
    marginTop: Spacing.two,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.9,
  },
  button: {
    width: 60,
    height: 40,
    backgroundColor: '#D60202',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: -Spacing.three, // to pull it flush to the edge if needed, or adjust radius
    marginBottom: -Spacing.three,
    borderBottomLeftRadius: 20,
  },
});
