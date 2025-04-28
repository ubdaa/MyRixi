import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Components
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { NeoButton } from '@/components/ui/NeoButton';
import { GlassInput } from '@/components/ui/GlassInput';

// Mock community data (replace with real data fetching)
const fetchCommunityData = async (id: string) => {
  return {
    id,
    name: 'Communauté Neo-Tokyo',
    description: 'Une communauté de passionnés de culture cyberpunk et futuriste',
    imageSrc: 'https://placehold.co/400x400/8A2EFF/FFFFFF?text=NT',
    memberCount: 1248,
    createdAt: '2025-01-15'
  };
};

export default function CommunityGeneralSettingsScreen() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const loadCommunity = async () => {
      if (typeof communityId === 'string') {
        const data = await fetchCommunityData(communityId);
        setName(data.name);
        setDescription(data.description);
        setImageSrc(data.imageSrc);
        setLoading(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', description: '' };
    
    if (!name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
      isValid = false;
    }
    
    if (description.trim().length > 500) {
      newErrors.description = 'La description ne doit pas dépasser 500 caractères';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "Modifications sauvegardées",
        "Les informations de la communauté ont été mises à jour avec succès.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImageSrc(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Informations" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
          </View>
        ) : (
          <>
            {/* Community Image Section */}
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={pickImage}>
                {imageSrc ? (
                  <Image source={{ uri: imageSrc }} style={styles.communityImage} />
                ) : (
                  <View style={[
                    styles.placeholderImage, 
                    { backgroundColor: theme.colors.background2 }
                  ]}>
                    <Ionicons name="image-outline" size={40} color={theme.colors.textSecondary} />
                  </View>
                )}
                
                <View style={[
                  styles.editBadge, 
                  { backgroundColor: theme.colors.cyberPink }
                ]}>
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Community Information Form */}
            <SettingsSection>
              <View style={styles.formContainer}>
                <GlassInput
                  label="Nom de la communauté"
                  placeholder="Entrez le nom de la communauté"
                  value={name}
                  onChangeText={setName}
                  error={errors.name}
                  accentColor={theme.colors.technoBlue}
                  containerStyle={styles.inputContainer}
                />
                
                <GlassInput
                  label="Description"
                  placeholder="Décrivez votre communauté"
                  value={description}
                  onChangeText={setDescription}
                  error={errors.description}
                  accentColor={theme.colors.technoBlue}
                  multiline
                  numberOfLines={4}
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.textareaInput}
                />
                
                <View style={styles.charCounter}>
                  <Text style={{ 
                    color: description.length > 450 
                      ? (description.length > 500 ? theme.colors.cyberPink : theme.colors.solarGold) 
                      : theme.colors.textSecondary
                  }}>
                    {description.length}/500
                  </Text>
                </View>
              </View>
            </SettingsSection>
            
            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <NeoButton 
                title="Enregistrer les modifications"
                onPress={handleSave}
                loading={saving}
                accentColor={theme.colors.technoBlue}
                style={styles.saveButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  communityImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textareaInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCounter: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  saveButton: {
    width: '100%',
  },
});