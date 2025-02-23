import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { apiPostRequest } from '@/services/api';
import { AxiosError } from 'axios';
import * as FileSystem from 'expo-file-system';

interface CommunityRule {
  title: string;
  description: string;
}

export default function CreateCommunityScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [rules, setRules] = useState<CommunityRule[]>([]);

  const addRule = () => {
    setRules([...rules, { title: '', description: '' }]);
  };

  const updateRule = (index: number, field: 'title' | 'description', value: string) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      // TODO: Upload image to storage and get URL
      if (type === 'avatar') {
        setAvatarUrl(result.assets[0].uri);
      } else {
        setBannerUrl(result.assets[0].uri);
      }
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('isPrivate', isPrivate.toString());
    
    if (avatarUrl) {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(avatarUrl);
      formData.append('icon', {
        uri: avatarUrl,
        name: 'icon.jpg',
        type: 'image/jpeg',
      } as any);
    }
    
    if (bannerUrl) {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(bannerUrl);
      formData.append('cover', {
        uri: bannerUrl,
        name: 'cover.jpg',
        type: 'image/jpeg',
      } as any);
    }
  
    rules.forEach((rule, index) => {
      formData.append(`rules[${index}].title`, rule.title);
      formData.append(`rules[${index}].description`, rule.description);
    });
  
    try {
      const response = await apiPostRequest('/community/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Community</Text>
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

        <TouchableOpacity
          style={styles.avatarPicker}
          onPress={() => pickImage('avatar')}
        >
          {avatarUrl ? (
            <Image source={avatarUrl} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#666" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Community Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter community name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's your community about?"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Private Community</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#767577', true: '#4c669f' }}
              thumbColor={isPrivate ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.rulesSection}>
            <Text style={styles.label}>Community Rules</Text>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleContainer}>
                <TextInput
                  style={styles.input}
                  value={rule.title}
                  onChangeText={(value) => updateRule(index, 'title', value)}
                  placeholder="Rule title"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={rule.description}
                  onChangeText={(value) => updateRule(index, 'description', value)}
                  placeholder="Rule description"
                  multiline
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeRule(index)}
                >
                  <Ionicons name="trash-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addRuleButton} onPress={addRule}>
              <Text style={styles.addRuleButtonText}>Add Rule</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.createButton, !name && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={!name}
          >
            <Text style={styles.createButtonText}>Create Community</Text>
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
  rulesSection: {
    marginBottom: 24,
  },
  ruleContainer: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  addRuleButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addRuleButtonText: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
});