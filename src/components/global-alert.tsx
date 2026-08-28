import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useAlertStore } from '@/store/alert.store';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';

const { width } = Dimensions.get('window');

export const GlobalAlert = () => {
  const { isVisible, title, message, buttons, hideAlert } = useAlertStore();
  const [isRendered, setIsRendered] = useState(false);
  
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRendered(false);
      });
    }
  }, [isVisible]);

  if (!isRendered) return null;

  const handlePress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      setTimeout(onPress, 200); // Give time for exit animation
    }
  };

  const defaultButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents={isVisible ? 'auto' : 'none'}>
      <Animated.View style={[styles.alertBox, { transform: [{ scale }] }]}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {!!message && <ThemedText style={styles.message}>{message}</ThemedText>}
        
        <View style={styles.buttonContainer}>
          {defaultButtons.map((btn, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.button, 
                index > 0 && styles.buttonBorder,
                btn.style === 'destructive' && { backgroundColor: Colors.light.tintRed }
              ]} 
              onPress={() => handlePress(btn.onPress)}
            >
              <Text style={[
                styles.buttonText, 
                btn.style === 'cancel' && { color: Colors.light.textSecondary, fontWeight: 'normal' },
                btn.style === 'destructive' && { color: '#fff' }
              ]}>
                {btn.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingTop: Spacing.four,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBorder: {
    borderLeftWidth: 1,
    borderColor: '#eee',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tintBlue,
  },
});
