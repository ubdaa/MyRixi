import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Components
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { NeoButton } from '@/components/ui/NeoButton';
import { GlassInput } from '@/components/ui/GlassInput';

// Mock community rules (replace with real data fetching)
const fetchCommunityRules = async (id: string) => {
  return [
    { id: '1', title: 'Respect mutuel', description: 'Soyez respectueux envers les autres membres de la communauté.' },
    { id: '2', title: 'Contenu approprié', description: 'Ne partagez pas de contenu offensant ou inapproprié.' },
    { id: '3', title: 'Non au spam', description: 'Évitez de spammer ou de faire de la publicité non sollicitée.' },
  ];
};

interface Rule {
  id: string;
  title: string;
  description: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export default function CommunityRulesScreen() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const { theme, colorMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  
  // Current editing values
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);

  useEffect(() => {
    const loadRules = async () => {
      if (typeof communityId === 'string') {
        const data = await fetchCommunityRules(communityId);
        setRules(data);
        setLoading(false);
      }
    };

    loadRules();
  }, [communityId]);

  const handleAddRule = () => {
    const newRule: Rule = {
      id: `new-${Date.now()}`,
      title: '',
      description: '',
      isNew: true,
      isEditing: true
    };
    
    setRules([...rules, newRule]);
    setCurrentRule(newRule);
  };

  const handleEditRule = (rule: Rule) => {
    setCurrentRule({ ...rule, isEditing: true });
    setRules(rules.map(r => r.id === rule.id ? { ...r, isEditing: true } : r));
  };

  const handleDeleteRule = (ruleId: string) => {
    Alert.alert(
      "Supprimer la règle",
      "Êtes-vous sûr de vouloir supprimer cette règle ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => {
            setRules(rules.filter(r => r.id !== ruleId));
            if (currentRule?.id === ruleId) {
              setCurrentRule(null);
            }
          } 
        }
      ]
    );
  };

  const handleSaveRule = () => {
    if (!currentRule) return;
    
    if (!currentRule.title.trim()) {
      Alert.alert("Erreur", "Le titre de la règle est obligatoire.");
      return;
    }
    
    setRules(rules.map(rule => 
      rule.id === currentRule.id 
        ? { ...currentRule, isEditing: false, isNew: false }
        : rule
    ));
    
    setCurrentRule(null);
  };

  const handleSaveAllRules = () => {
    if (currentRule) {
      // If still editing, save the current rule first
      handleSaveRule();
    }
    
    setSaving(true);
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "Règles sauvegardées",
        "Les règles de la communauté ont été mises à jour avec succès.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1000);
  };

  const RuleItem = ({ rule }: { rule: Rule }) => {
    const isEditing = rule.isEditing || false;
    
    return (
      <BlurView
        intensity={5}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.ruleItem, 
          { borderRadius: theme.roundness, marginBottom: 12 }
        ]}
      >
        <View style={[
          styles.ruleInner,
          { backgroundColor: colorMode === 'dark' ? 'rgba(26, 27, 31, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
        ]}>
          {isEditing ? (
            <View style={styles.ruleEditForm}>
              <GlassInput
                label="Titre de la règle"
                placeholder="Ex: Respect mutuel"
                value={currentRule?.title || ''}
                onChangeText={(text) => setCurrentRule(prev => prev ? { ...prev, title: text } : null)}
                accentColor={theme.colors.synthGreen}
                containerStyle={styles.inputContainer}
              />
              
              <GlassInput
                label="Description"
                placeholder="Expliquez la règle en détail"
                value={currentRule?.description || ''}
                onChangeText={(text) => setCurrentRule(prev => prev ? { ...prev, description: text } : null)}
                accentColor={theme.colors.synthGreen}
                multiline
                numberOfLines={3}
                containerStyle={styles.inputContainer}
                inputStyle={styles.textareaInput}
              />
              
              <View style={styles.editButtons}>
                <NeoButton
                  title="Annuler"
                  onPress={() => {
                    if (rule.isNew) {
                      setRules(rules.filter(r => r.id !== rule.id));
                    } else {
                      setRules(rules.map(r => r.id === rule.id ? { ...r, isEditing: false } : r));
                    }
                    setCurrentRule(null);
                  }}
                  variant="outline"
                  size="small"
                  accentColor={theme.colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
                
                <NeoButton
                  title="Enregistrer"
                  onPress={handleSaveRule}
                  size="small"
                  accentColor={theme.colors.synthGreen}
                />
              </View>
            </View>
          ) : (
            <View style={styles.ruleContent}>
              <View style={styles.ruleTitleRow}>
                <Text style={[styles.ruleTitle, { color: theme.colors.textPrimary }]}>
                  {rule.title}
                </Text>
                
                <View style={styles.ruleActions}>
                  <TouchableOpacity 
                    onPress={() => handleEditRule(rule)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="pencil" size={18} color={theme.colors.technoBlue} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDeleteRule(rule.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="trash-bin" size={18} color={theme.colors.neoRed} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={[styles.ruleDescription, { color: theme.colors.textSecondary }]}>
                {rule.description}
              </Text>
            </View>
          )}
        </View>
      </BlurView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Règles" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
          </View>
        ) : (
          <>
            <SettingsSection
              title="Règles de la communauté"
              footer="Ces règles seront visibles par tous les membres et doivent être respectées"
            >
              <View style={styles.rulesContainer}>
                {rules.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Aucune règle définie. Ajoutez une première règle pour votre communauté.
                  </Text>
                ) : (
                  rules.map((rule) => <RuleItem key={rule.id} rule={rule} />)
                )}
                
                <NeoButton
                  title="Ajouter une règle"
                  onPress={handleAddRule}
                  variant="outline"
                  accentColor={theme.colors.synthGreen}
                  style={styles.addButton}
                  disabled={!!currentRule}
                />
              </View>
            </SettingsSection>
            
            <View style={styles.buttonContainer}>
              <NeoButton 
                title="Enregistrer toutes les règles"
                onPress={handleSaveAllRules}
                loading={saving}
                accentColor={theme.colors.synthGreen}
                style={styles.saveButton}
                disabled={!!currentRule}
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
  rulesContainer: {
    padding: 16,
  },
  ruleItem: {
    overflow: 'hidden',
  },
  ruleInner: {
    width: '100%',
    padding: 16,
  },
  ruleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  ruleDescription: {
    fontSize: 14,
  },
  ruleActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  ruleContent: {
    width: '100%',
  },
  ruleEditForm: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 8,
  },
  textareaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  addButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  saveButton: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 16,
  },
});