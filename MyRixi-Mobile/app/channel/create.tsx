import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { apiPostRequest } from '@/services/api';
import { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateChannelScreen() {
  const { communityId } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [bannerUrl, setBannerUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  if (!communityId) {
    <View style={styles.container}>
      <Text>Community ID is required</Text>
    </View>
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setBannerUrl(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('isPrivate', isPrivate.toString());
    
    if (bannerUrl) {
      formData.append('cover', {
        uri: bannerUrl,
        name: 'cover.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      await apiPostRequest(`/channel/community/${communityId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.replace(`/community/${communityId}/chats`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Channel</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.bannerPicker}
              onPress={pickImage}
            >
              {bannerUrl ? (
                <Image source={bannerUrl} style={styles.banner} contentFit="cover" />
              ) : (
                <LinearGradient colors={['#e0e0e0', '#f5f5f5']} style={styles.bannerPlaceholder}>
                  <Ionicons name="image-outline" size={36} color="#888" />
                  <Text style={styles.pickerText}>Add Banner Image</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Channel Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter channel name"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What's your channel about?"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Private Channel</Text>
                    <Text style={styles.switchDescription}>Only community members with permission can see this channel</Text>
                  </View>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: '#d1d1d1', true: '#b7c9e2' }}
                    thumbColor={isPrivate ? '#4a7fe0' : '#f4f3f4'}
                    ios_backgroundColor="#d1d1d1"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, (!name || isLoading) && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!name || isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#5e8fe2', '#4a7fe0']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Channel'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  bannerPicker: {
    width: '100%',
    height: 180,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    marginTop: 12,
    color: '#888',
    fontSize: 16,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  switchGroup: {
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchDescription: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    maxWidth: '90%',
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ececec',
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});