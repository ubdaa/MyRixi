import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Keyboard,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { apiPostRequest } from "@/services/api";
import { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassInput } from "@/components/ui/GlassInput";
import { NeoButton } from "@/components/ui/NeoButton";
import { GlassCard } from "@/components/ui/GlassCard";

interface CommunityRule {
  title: string;
  description: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 64;

export default function CreateCommunityScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme, colorMode } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // état du formulaire
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isInviteOnly, setIsInviteOnly] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [rules, setRules] = useState<CommunityRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const router = useRouter();

  const addRule = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRules([...rules, { title: "", description: "" }]);

    // Scroll vers le bas après ajout d'une règle
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const updateRule = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const removeRule = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRules(rules.filter((_, i) => i !== index));
  };

  const pickImage = async (type: "avatar" | "banner") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      // TODO: Upload image to storage and get URL
      if (type === "avatar") {
        setAvatarUrl(result.assets[0].uri);
      } else {
        setBannerUrl(result.assets[0].uri);
      }
    }
  };

  // Gestion de fermeture
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.back());
  };

  const handleCreate = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isPrivate", isPrivate.toString());
    formData.append("isInviteOnly", isInviteOnly.toString());

    if (avatarUrl) {
      formData.append("icon", {
        uri: avatarUrl,
        name: "icon.jpg",
        type: "image/jpeg",
      } as any);
    }

    if (bannerUrl) {
      formData.append("cover", {
        uri: bannerUrl,
        name: "cover.jpg",
        type: "image/jpeg",
      } as any);
    }

    rules.forEach((rule, index) => {
      formData.append(`rules[${index}].title`, rule.title);
      formData.append(`rules[${index}].description`, rule.description);
    });

    try {
      await apiPostRequest("/community/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/communities");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
      />

      {/* Arrière-plan flou */}
      <BlurView
        intensity={20}
        tint={colorMode === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFillObject}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={handleClose}
        />
      </BlurView>

      {/* Tiroir modal */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            backgroundColor:
              colorMode === "dark"
                ? "rgba(26, 27, 31, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidView}
          keyboardVerticalOffset={isKeyboardVisible ? -100 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.contentContainer,
              { paddingTop: insets.top },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.bannerPicker}
                onPress={() => pickImage("banner")}
              >
                {bannerUrl ? (
                  <Image
                    source={bannerUrl}
                    style={styles.banner}
                    contentFit="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={["#e0e0e0", "#f5f5f5"]}
                    style={styles.bannerPlaceholder}
                  >
                    <Ionicons name="image-outline" size={36} color="#888" />
                    <Text style={styles.pickerText}>Ajouter une bannière</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.avatarPicker}
                onPress={() => pickImage("avatar")}
              >
                {avatarUrl ? (
                  <Image
                    source={avatarUrl}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={32}
                      color="#888"
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.form}>
                <GlassInput
                  label="Nom de la communauté"
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Passionnés de Design"
                  accentColor={theme.colors.cyberPink}
                />

                <GlassInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="De quoi parle votre communauté ?"
                  multiline
                  numberOfLines={4}
                  containerStyle={{ marginTop: 16 }}
                  inputStyle={{ height: 100, textAlignVertical: 'top' }}
                />

                <View style={styles.divider} />

                <View style={styles.switchGroup}>
                  <View style={styles.switchContainer}>
                    <View>
                      <Text style={styles.label}>Communauté privée</Text>
                      <Text style={styles.switchDescription}>
                        La communauté n'est pas publique
                      </Text>
                    </View>
                    <Switch
                      value={isPrivate}
                      onValueChange={setIsPrivate}
                      trackColor={{ false: "#d1d1d1", true: "#b7c9e2" }}
                      thumbColor={isPrivate ? "#4a7fe0" : "#f4f3f4"}
                      ios_backgroundColor="#d1d1d1"
                    />
                  </View>

                  <View style={styles.switchContainer}>
                    <View>
                      <Text style={styles.label}>Sur invitation uniquement</Text>
                      <Text style={styles.switchDescription}>
                        Pour rejoindre uniquement sur invitation
                      </Text>
                    </View>
                    <Switch
                      value={isInviteOnly}
                      onValueChange={setIsInviteOnly}
                      trackColor={{ false: "#d1d1d1", true: "#b7c9e2" }}
                      thumbColor={isInviteOnly ? "#4a7fe0" : "#f4f3f4"}
                      ios_backgroundColor="#d1d1d1"
                    />
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.rulesSection}>
                  <Text style={styles.sectionTitle}>Règles de la communauté</Text>

                  {rules.map((rule, index) => (
                    <View key={index} style={styles.ruleContainer}>
                      <View style={styles.ruleView}>
                        <Text style={styles.ruleTitle}>Règle {index + 1}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeRule(index)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={22}
                            color={theme.colors.cyberPink} 
                          />
                        </TouchableOpacity>
                      </View>
                      <GlassInput
                        style={styles.ruleInput}
                        value={rule.title}
                        onChangeText={(value) =>
                          updateRule(index, "title", value)
                        }
                        placeholder="Titre de la règle"
                        placeholderTextColor="#aaa"
                      />
                      <GlassInput
                        style={[styles.ruleInput, styles.textArea]}
                        value={rule.description}
                        onChangeText={(value) =>
                          updateRule(index, "description", value)
                        }
                        placeholder="Description de la règle"
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
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color="#4a7fe0"
                    />
                    <Text style={styles.addRuleButtonText}>Ajouter une règle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <BlurView
          intensity={25}
          tint={colorMode === "dark" ? "dark" : "light"}
          style={[
            styles.actionBar,
            {
              backgroundColor:
                colorMode === "dark"
                  ? "rgba(20, 19, 22, 0.7)"
                  : "rgba(248, 248, 250, 0.7)",
            },
          ]}
        >
          <View style={styles.actionButtons}>
            <NeoButton
              title="Annuler"
              onPress={handleClose}
              variant="outline"
              style={{ flex: 1, marginRight: 12 }}
            />

            <NeoButton
              title="Créer"
              onPress={handleCreate}
              loading={isLoading}
              disabled={!name.trim()}
              style={{ flex: 2 }}
              accentColor={theme.colors.cyberPink}
            />
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  bannerPicker: {
    width: "100%",
    height: 180,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginTop: -50,
    marginLeft: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  pickerText: {
    marginTop: 12,
    color: "#888",
    fontSize: 16,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 4,
    shadowColor: "#000",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchGroup: {
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  switchDescription: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#ececec",
    marginVertical: 16,
  },
  rulesSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  ruleContainer: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  ruleInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ruleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  removeButton: {},
  addRuleButton: {
    backgroundColor: "#f0f7ff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0edff",
    borderStyle: "dashed",
  },
  addRuleButtonText: {
    color: "#4a7fe0",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ececec",
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
