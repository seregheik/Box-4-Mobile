import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AgentService } from '@/services/agent.service';
import { useProfileStore } from '@/store/profile.store';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { profile, updateProfileData } = useProfileStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(profile?.user?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [agency, setAgency] = useState(profile?.agency_name || '');
  const [license, setLicense] = useState(profile?.license_number || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        user: { full_name: fullName },
        phone_number: phone,
        city,
        state,
        country,
        agency_name: agency,
        license_number: license,
        bio
      };

      const updatedProfile = await AgentService.updateProfile(payload);
      updateProfileData(updatedProfile);
      
      Alert.alert("Success", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.tintBlue} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <FormGroup label="Full Name">
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor={theme.textSecondary}
            />
          </FormGroup>

          <FormGroup label="Phone Number">
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              placeholderTextColor={theme.textSecondary}
            />
          </FormGroup>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.two }}>
              <FormGroup label="City">
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                  value={city}
                  onChangeText={setCity}
                  placeholder="New York"
                  placeholderTextColor={theme.textSecondary}
                />
              </FormGroup>
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.two }}>
              <FormGroup label="State/Province">
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
                  value={state}
                  onChangeText={setState}
                  placeholder="NY"
                  placeholderTextColor={theme.textSecondary}
                />
              </FormGroup>
            </View>
          </View>

          <FormGroup label="Country">
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={country}
              onChangeText={setCountry}
              placeholder="United States"
              placeholderTextColor={theme.textSecondary}
            />
          </FormGroup>

          <FormGroup label="Agency Name (Optional)">
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={agency}
              onChangeText={setAgency}
              placeholder="Elite Real Estate"
              placeholderTextColor={theme.textSecondary}
            />
          </FormGroup>

          <FormGroup label="License Number (Optional)">
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={license}
              onChangeText={setLicense}
              placeholder="RE-1234567"
              placeholderTextColor={theme.textSecondary}
            />
          </FormGroup>

          <FormGroup label="Bio">
            <TextInput
              style={[styles.input, styles.textArea, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell clients about yourself..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </FormGroup>

        </ScrollView>

        {/* Footer actions */}
        <View style={[styles.footer, { borderTopColor: theme.border || '#eee' }]}>
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.tintBlue, opacity: isSaving ? 0.7 : 1 }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <View style={styles.formGroup}>
      <ThemedText style={styles.label} themeColor="textSecondary">{label}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  formGroup: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.two,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.three,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});
