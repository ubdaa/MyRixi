import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { apiPostRequest } from '@/services/api';
import { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

interface CommunityRule {
  title: string;
  description: string;
}

export default function CreateCommunityScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isInviteOnly, setIsInviteOnly] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('isPrivate', isPrivate.toString());
    formData.append('isInviteOnly', isInviteOnly.toString());
    
    if (avatarUrl) {
      formData.append('icon', {
        uri: avatarUrl,
        name: 'icon.jpg',
        type: 'image/jpeg',
      } as any);
    }
    
    if (bannerUrl) {
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
      await apiPostRequest('/community/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.replace("/communities");
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
        <Text style={styles.title}>Create Community</Text>
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
              onPress={() => pickImage('banner')}
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

            <TouchableOpacity
              style={styles.avatarPicker}
              onPress={() => pickImage('avatar')}
            >
              {avatarUrl ? (
                <Image source={avatarUrl} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialCommunityIcons name="camera-plus" size={32} color="#888" />
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
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What's your community about?"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Private Community</Text>
                    <Text style={styles.switchDescription}>The community is not referenced publicly</Text>
                  </View>
                  <Switch
                    value={isPrivate}
                    onValueChange={setIsPrivate}
                    trackColor={{ false: '#d1d1d1', true: '#b7c9e2' }}
                    thumbColor={isPrivate ? '#4a7fe0' : '#f4f3f4'}
                    ios_backgroundColor="#d1d1d1"
                  />
                </View>

                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.label}>Invite only</Text>
                    <Text style={styles.switchDescription}>New members need invitations</Text>
                  </View>
                  <Switch
                    value={isInviteOnly}
                    onValueChange={setIsInviteOnly}
                    trackColor={{ false: '#d1d1d1', true: '#b7c9e2' }}
                    thumbColor={isInviteOnly ? '#4a7fe0' : '#f4f3f4'}
                    ios_backgroundColor="#d1d1d1"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.rulesSection}>
                <Text style={styles.sectionTitle}>Community Rules</Text>
                
                {rules.map((rule, index) => (
                  <View key={index} style={styles.ruleContainer}>
                    <View style={styles.ruleView}>
                      <Text style={styles.ruleTitle}>
                        Rule {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeRule(index)}
                      >
                        <Ionicons name="trash-outline" size={22} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.ruleInput}
                      value={rule.title}
                      onChangeText={(value) => updateRule(index, 'title', value)}
                      placeholder="Rule title"
                      placeholderTextColor="#aaa"
                    />
                    <TextInput
                      style={[styles.ruleInput, styles.textArea]}
                      value={rule.description}
                      onChangeText={(value) => updateRule(index, 'description', value)}
                      placeholder="Rule description"
                      placeholderTextColor="#aaa"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                ))}
                
                <TouchableOpacity 
                  style={styles.addRuleButton} 
                  onPress={addRule}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle-outline" size={22} color="#4a7fe0" />
                  <Text style={styles.addRuleButtonText}>Add Rule</Text>
                </TouchableOpacity>
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
              {isLoading ? 'Creating...' : 'Create Community'}
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
  avatarPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginTop: -50,
    marginLeft: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
    marginTop: 4,
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
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 16,
  },
  rulesSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ruleContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  ruleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ececec',
    marginBottom: 10,
  },
  ruleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
  },
  addRuleButton: {
    backgroundColor: '#f0f7ff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0edff',
    borderStyle: 'dashed',
  },
  addRuleButtonText: {
    color: '#4a7fe0',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
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