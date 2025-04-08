import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { GlassInput } from '@/components/ui/GlassInput';
import { usePosts } from '@/hooks/usePosts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addAttachmentToDraft } from '@/services/postService';
import { ImageSection } from '@/components/post/ImageSection';
import { TagsSection } from '@/components/post/TagsSection';
import { ActionButtons } from '@/components/post/ActionButtons';

// Types pour notre formulaire
interface PostFormData {
  title: string;
  content: string;
  images: Array<{uri: string; id: string}>;
  tags: Array<{id: string; name: string; color: string}>;
}

// Interface pour les handlers externes
export default function PostForm() {
  const { theme } = useTheme();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const currentDraftId = draftId;
  const router = useRouter();
  
  // Initialisation du hook usePosts
  const { 
    drafts, 
    refreshDrafts,
    loadDraftById,
    updateDraft, 
    publishDraft, 
    deleteDraft,
    removeAttachment 
  } = usePosts();
  
  // État du formulaire
  const [formData, setFormData] = useState<PostFormData>({
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
      if (currentDraftId) {
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
  }, [currentDraftId, drafts]);
  
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
      
      await updateDraft(currentDraftId, {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.map(tag => ({
          Name: tag.name,
        }))
      });
      
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
              await deleteDraft(currentDraftId);
              Alert.alert('Succès', 'Brouillon supprimé avec succès');
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

              await publishDraft(currentDraftId, {
                title: formData.title,
                content: formData.content,
                tags: formData.tags.map(tag => ({
                  Name: tag.name,
                }))
              });

              await refreshDrafts();

              // Rediriger vers la page du post publié
              router.push(`/post/${currentDraftId}/page`);
              
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
          <ImageSection 
            images={formData.images}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            textColor={theme.colors.textPrimary}
            accentColor={theme.colors.technoBlue}
            textSecondary={theme.colors.textSecondary}
            dividerColor={theme.colors.divider}
            isSubmitting={isSubmitting}
          />
          
          {/* Section des tags */}
          <TagsSection 
            tags={formData.tags}
            newTag={newTag}
            onChangeNewTag={setNewTag}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            textColor={theme.colors.textPrimary}
            accentColor={theme.colors.solarGold}
            textSecondary={theme.colors.textSecondary}
            dividerColor={theme.colors.divider}
          />
          
          {/* Boutons d'action */}
          <ActionButtons 
            onSave={handleSaveDraft}
            onDelete={handleDeleteDraft}
            onPublish={handlePublish}
            saveColor={theme.colors.synthGreen}
            deleteColor={theme.colors.neoRed}
            publishColor={theme.colors.cyberPink}
            isDisabled={isSubmitting}
          />
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
});