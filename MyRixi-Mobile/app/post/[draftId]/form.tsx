import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Pressable,
  Alert,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassInput } from '@/components/ui/GlassInput';
import { usePosts } from '@/hooks/usePosts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addAttachmentToDraft } from '@/services/postService';

// Types pour notre formulaire
interface PostFormData {
  title: string;
  content: string;
  images: Array<{uri: string; id: string}>;
  tags: Array<{id: string; name: string; color: string}>;
}

// Interface pour les handlers externes
interface PostFormHandlers {
  onSaveDraft?: (data: PostFormData) => Promise<void>;
  onDeleteDraft?: (draftId: string) => Promise<void>;
  onPublish?: (data: PostFormData) => Promise<void>;
  existingDraft?: PostFormData;
  draftId?: string;
}

export default function PostForm({
  onSaveDraft,
  onDeleteDraft,
  onPublish,
  existingDraft,
  draftId: propDraftId
}: PostFormHandlers) {
  const { theme, colorMode } = useTheme();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const currentDraftId = propDraftId || draftId;
  const router = useRouter();
  
  // Initialisation du hook usePosts
  const { 
    drafts, 
    loading, 
    loadDraftById,
    updateDraft, 
    publishDraft, 
    removeAttachment 
  } = usePosts();
  
  // État du formulaire
  const [formData, setFormData] = useState<PostFormData>(existingDraft || {
    title: '',
    content: '',
    images: [],
    tags: []
  });
  
  // État pour gérer l'ajout de nouveaux tags
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Couleurs disponibles pour les tags basées sur le thème
  const tagColors = [
    theme.colors.cyberPink,
    theme.colors.neoPurple,
    theme.colors.technoBlue,
    theme.colors.synthGreen,
    theme.colors.solarGold,
    theme.colors.holoTurquoise,
    theme.colors.neoRed
  ];
  
  // Charger le brouillon si on a un draftId
  useEffect(() => {
    const loadDraft = async () => {
      if (currentDraftId && !existingDraft) {
        const draft = await loadDraftById(currentDraftId);
        console.log(draft);
        if (draft) {
          // Convertir le format de draft à PostFormData
          setFormData({
            title: draft.title || '',
            content: draft.content || '',
            images: draft.attachments?.map(att => ({
              uri: att.media.url, // Correction: access URL from the media object
              id: att.id
            })) || [],
            tags: draft.tags?.map(tag => ({
              id: tag.id,
              name: tag.description,
              color: tagColors[Math.floor(Math.random() * tagColors.length)]
            })) || []
          });
        }
      }
    };
    
    loadDraft();
  }, [currentDraftId, drafts, existingDraft]);
  
  // Handlers pour mettre à jour les champs du formulaire
  const handleTitleChange = (text: string) => {
    setFormData(prev => ({ ...prev, title: text }));
  };
  
  const handleContentChange = (text: string) => {
    setFormData(prev => ({ ...prev, content: text }));
  };
  
  // Handler pour ajouter un tag
  const handleAddTag = () => {
    if (newTag.trim()) {
      // Sélectionner aléatoirement une couleur pour le tag
      const color = tagColors[Math.floor(Math.random() * tagColors.length)];
      
      setFormData(prev => ({
        ...prev,
        tags: [
          ...prev.tags, 
          { id: Date.now().toString(), name: newTag.trim(), color }
        ]
      }));
      
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId)
    }));
  }
  
  // Handler pour ajouter des images
  const handleAddImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à votre galerie pour ajouter des images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: false,
      quality: 0.8,
    });
    
    if (!result.canceled && currentDraftId) {
      try {
        setIsSubmitting(true);
        
        for (const asset of result.assets) {
          // React Native n'a pas de constructeur File natif, donc on utilise FormData directement
          // avec l'URI de l'image et les métadonnées nécessaires
          const fileNameParts = asset.uri.split('/');
          const fileName = fileNameParts[fileNameParts.length - 1];
          
          // Ajouter l'attachment via le service
          const updatedDraft = await addAttachmentToDraft(
            currentDraftId,
            {
              uri: asset.uri,
              name: fileName,
              type: 'image/jpeg' // ou detecter dynamiquement le type via le nom de fichier
            }
          );

          if (updatedDraft) {
            // Ajouter localement l'image dans le state formData
            const newImage = {
              uri: asset.uri,
              id: updatedDraft.attachments[updatedDraft.attachments.length - 1].id
            };
            
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, newImage]
            }));
          }
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'ajouter les images');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Handler pour supprimer une image
  const handleRemoveImage = async (imageId: string) => {
    if (!currentDraftId) return;
    
    try {
      setIsSubmitting(true);
      const updatedDraft = await removeAttachment(currentDraftId, imageId);
      
      if (updatedDraft) {
        // Mettre à jour localement le state formData
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => img.id !== imageId)
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de supprimer l\'image');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handlers pour les actions principales
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Titre requis', 'Veuillez ajouter un titre à votre post avant de sauvegarder.');
      return;
    }
    
    if (!currentDraftId) return;
    
    try {
      setIsSubmitting(true);
      
      // Utiliser le handler externe si disponible
      if (onSaveDraft) {
        await onSaveDraft(formData);
      } else {
        // Sinon utiliser le hook
        await updateDraft(currentDraftId, {
          title: formData.title,
          content: formData.content,
          tags: formData.tags.map(tag => ({
            Name: tag.name,
          }))
        });
      }
      
      Alert.alert('Succès', 'Brouillon enregistré avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer le brouillon');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteDraft = async () => {
    if (!currentDraftId) return;
    
    Alert.alert(
      'Supprimer le brouillon',
      'Êtes-vous sûr de vouloir supprimer ce brouillon? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              if (onDeleteDraft) {
                await onDeleteDraft(currentDraftId);
                Alert.alert('Succès', 'Brouillon supprimé avec succès');
              }
              // Rediriger vers la liste des brouillons
              router.back();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le brouillon');
              console.error(error);
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };
  
  const handlePublish = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Titre requis', 'Veuillez ajouter un titre à votre post avant de publier.');
      return;
    }
    
    if (!formData.content.trim()) {
      Alert.alert('Contenu requis', 'Veuillez ajouter du contenu à votre post avant de publier.');
      return;
    }
    
    if (!currentDraftId) return;
    
    Alert.alert(
      'Publier le post',
      'Êtes-vous sûr de vouloir publier ce post? Il sera visible par tous les utilisateurs.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Publier',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              // Utiliser le handler externe si disponible
              if (onPublish) {
                await onPublish(formData);
              } else {
                // Sinon utiliser le hook
                await publishDraft(currentDraftId, {
                  title: formData.title,
                  content: formData.content,
                  tags: formData.tags.map(tag => ({
                    Name: tag.name,
                  }))
                });
              }
              
              Alert.alert('Succès', 'Post publié avec succès');
              // Rediriger vers la liste des posts
              router.back();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de publier le post');
              console.error(error);
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background1}}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          style={[styles.container, { backgroundColor: theme.colors.background1, opacity: 1 }]} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Titre du formulaire */}
          <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
            {currentDraftId ? 'Modifier le post' : 'Créer un nouveau post'}
          </Text>
          
          {/* Champ titre */}
          <GlassInput
            label="Titre"
            placeholder="Donnez un titre à votre post"
            value={formData.title}
            onChangeText={handleTitleChange}
            accentColor={theme.colors.cyberPink}
            containerStyle={styles.inputContainer}
          />
          
          {/* Champ contenu */}
          <GlassInput
            label="Contenu"
            placeholder="Écrivez le contenu de votre post ici..."
            value={formData.content}
            onChangeText={handleContentChange}
            accentColor={theme.colors.technoBlue}
            multiline
            numberOfLines={5}
          />
          
          {/* Section des images */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Images</Text>
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.colors.technoBlue }]} 
                onPress={handleAddImages}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            
            {formData.images.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.imagesContainer}
                contentContainerStyle={styles.imagesContent}
              >
                {formData.images.map((image, index) => (
                  <View key={image.id} style={styles.imageWrapper}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => handleRemoveImage(image.id)}
                    >
                      <Ionicons name="close-circle" size={24} color={theme.colors.neoRed} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.emptyState, { borderColor: theme.colors.divider }]}>
                <MaterialCommunityIcons 
                  name="image-outline" 
                  size={36} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  Aucune image ajoutée
                </Text>
              </View>
            )}
          </View>
          
          {/* Section des tags */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <GlassInput
                  placeholder="Ajouter un tag"
                  value={newTag}
                  onChangeText={setNewTag}
                  containerStyle={{ flex: 1, marginRight: 10, marginVertical: 0 }}
                  accentColor={theme.colors.solarGold}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
                <TouchableOpacity 
                  style={[styles.tagAddButton, { backgroundColor: theme.colors.solarGold }]} 
                  onPress={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.tagsContainer}>
              {formData.tags.length > 0 ? (
                <View style={styles.tagsList}>
                  {formData.tags.map(tag => (
                    <View 
                      key={tag.id} 
                      style={[styles.tag, { backgroundColor: tag.color + '20', borderColor: tag.color }]}
                    >
                      <Text style={[styles.tagText, { color: tag.color }]}>
                        {tag.name}
                      </Text>
                      <TouchableOpacity 
                        style={styles.removeTagButton} 
                        onPress={() => handleRemoveTag(tag.id)}
                      >
                        <Ionicons name="close" size={16} color={tag.color} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyState, { borderColor: theme.colors.divider }]}>
                  <MaterialCommunityIcons 
                    name="tag-outline" 
                    size={36} 
                    color={theme.colors.textSecondary} 
                  />
                  <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Aucun tag ajouté
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Boutons d'action */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.synthGreen }]} 
              onPress={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Ionicons name="save-outline" size={20} color="#fff" />
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.neoRed }]} 
              onPress={handleDeleteDraft}
              disabled={isSubmitting}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: theme.colors.cyberPink }
              ]} 
              onPress={handlePublish}
              disabled={isSubmitting}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  contentInputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  contentBlurContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  contentInput: {
    minHeight: 150,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  imagesContainer: {
    paddingVertical: 10,
    maxHeight: 120,
  },
  imagesContent: {
    paddingRight: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    zIndex: 10,
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  tagAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    marginTop: 5,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '500',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  publishButton: {
    flex: 1.5,
  },
});