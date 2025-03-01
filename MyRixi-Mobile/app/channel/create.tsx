import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { apiPostRequest } from '@/services/api';
import { AxiosError } from 'axios';

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

  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
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
    
    // if (bannerUrl) {
    //   formData.append('cover', {
    //     uri: bannerUrl,
    //     name: 'cover.jpg',
    //     type: 'image/jpeg',
    //   } as any);
    // }

    try {
      console.log(communityId);
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Channel</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.bannerPicker}
          onPress={() => pickImage('banner')}
        >
          {bannerUrl ? (
            <Image source={bannerUrl} style={styles.banner} contentFit="cover" />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Ionicons name="image-outline" size={32} color="#666" />
              <Text style={styles.pickerText}>Add Banner Image</Text>
            </View>
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's your channel about?"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Private Channel</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#767577', true: '#4c669f' }}
              thumbColor={isPrivate ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, !name && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={(!name && !description && !bannerUrl) || isLoading}
          >
            <Text style={styles.createButtonText}>Create channel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Ajoutez ces styles supplémentaires
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  bannerPicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatarPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginTop: -50,
    marginLeft: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  pickerText: {
    marginTop: 8,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});