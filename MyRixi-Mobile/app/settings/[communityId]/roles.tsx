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

// Mock role data (replace with real data fetching)
const fetchRolesData = async (id: string) => {
  return [
    { 
      id: '1', 
      name: 'Administrateur', 
      color: '#FF4F9A', 
      permissions: ['manage_community', 'manage_members', 'manage_posts', 'manage_rules'], 
      isDefault: true,
      memberCount: 2
    },
    { 
      id: '2', 
      name: 'Modérateur', 
      color: '#18A0FB', 
      permissions: ['manage_posts', 'manage_comments'], 
      isDefault: false,
      memberCount: 4
    },
    { 
      id: '3', 
      name: 'Membre VIP', 
      color: '#FBC02D', 
      permissions: ['create_events'], 
      isDefault: false,
      memberCount: 12
    },
  ];
};

// Available permissions with descriptions
const availablePermissions = [
  { id: 'manage_community', name: 'Gérer la communauté', description: 'Modifier les paramètres généraux' },
  { id: 'manage_members', name: 'Gérer les membres', description: 'Inviter, exclure, promouvoir des membres' },
  { id: 'manage_posts', name: 'Gérer les publications', description: 'Épingler, masquer, supprimer des publications' },
  { id: 'manage_comments', name: 'Gérer les commentaires', description: 'Modérer les commentaires' },
  { id: 'manage_rules', name: 'Gérer les règles', description: 'Modifier les règles de la communauté' },
  { id: 'create_events', name: 'Créer des événements', description: 'Créer et gérer des événements' },
];

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
  isDefault?: boolean;
  memberCount: number;
  isNew?: boolean;
  isEditing?: boolean;
}

export default function CommunityRolesScreen() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const { theme, colorMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  // Predefined colors for roles
  const roleColors = [
    theme.colors.cyberPink,
    theme.colors.technoBlue,
    theme.colors.synthGreen,
    theme.colors.solarGold,
    theme.colors.neoPurple,
    theme.colors.holoTurquoise,
  ];

  useEffect(() => {
    const loadRoles = async () => {
      if (typeof communityId === 'string') {
        const data = await fetchRolesData(communityId);
        setRoles(data);
        setLoading(false);
      }
    };

    loadRoles();
  }, [communityId]);

  const handleAddRole = () => {
    const newRole: Role = {
      id: `new-${Date.now()}`,
      name: '',
      color: roleColors[Math.floor(Math.random() * roleColors.length)],
      permissions: [],
      isNew: true,
      isEditing: true,
      memberCount: 0
    };
    
    setRoles([...roles, newRole]);
    setCurrentRole(newRole);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole({ ...role, isEditing: true });
    setRoles(roles.map(r => r.id === role.id ? { ...r, isEditing: true } : r));
  };

  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find(r => r.id === roleId);
    
    if (roleToDelete?.isDefault) {
      Alert.alert("Erreur", "Impossible de supprimer le rôle par défaut.");
      return;
    }
    
    if (roleToDelete?.memberCount && roleToDelete.memberCount > 0) {
      Alert.alert(
        "Attention", 
        `Ce rôle est assigné à ${roleToDelete.memberCount} membres. Supprimer ce rôle l'enlèvera de tous ces membres.`,
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Supprimer quand même", 
            style: "destructive", 
            onPress: () => {
              setRoles(roles.filter(r => r.id !== roleId));
              if (currentRole?.id === roleId) {
                setCurrentRole(null);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Supprimer le rôle",
        "Êtes-vous sûr de vouloir supprimer ce rôle ?",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Supprimer", 
            style: "destructive", 
            onPress: () => {
              setRoles(roles.filter(r => r.id !== roleId));
              if (currentRole?.id === roleId) {
                setCurrentRole(null);
              }
            }
          }
        ]
      );
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!currentRole) return;
    
    setCurrentRole(prev => {
      if (!prev) return null;
      
      let updatedPermissions;
      if (prev.permissions.includes(permissionId)) {
        updatedPermissions = prev.permissions.filter(id => id !== permissionId);
      } else {
        updatedPermissions = [...prev.permissions, permissionId];
      }
      
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleChangeColor = () => {
    if (!currentRole) return;
    
    // Rotate through colors
    const currentIndex = roleColors.indexOf(currentRole.color);
    const nextIndex = (currentIndex + 1) % roleColors.length;
    
    setCurrentRole({
      ...currentRole,
      color: roleColors[nextIndex]
    });
  };

  const handleSaveRole = () => {
    if (!currentRole) return;
    
    if (!currentRole.name.trim()) {
      Alert.alert("Erreur", "Le nom du rôle est obligatoire.");
      return;
    }
    
    setRoles(roles.map(role => 
      role.id === currentRole.id 
        ? { ...currentRole, isEditing: false, isNew: false }
        : role
    ));
    
    setCurrentRole(null);
  };

  const handleSaveAllRoles = () => {
    if (currentRole) {
      // If still editing, save the current role first
      handleSaveRole();
    }
    
    setSaving(true);
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "Rôles sauvegardés",
        "Les rôles de la communauté ont été mis à jour avec succès.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1000);
  };

  const RoleItem = ({ role }: { role: Role }) => {
    const isEditing = role.isEditing || false;
    
    return (
      <BlurView
        intensity={5}
        tint={colorMode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.roleItem, 
          { borderRadius: theme.roundness, marginBottom: 16 }
        ]}
      >
        <View style={[
          styles.roleInner,
          { backgroundColor: colorMode === 'dark' ? 'rgba(26, 27, 31, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
        ]}>
          {isEditing ? (
            <View style={styles.roleEditForm}>
              <View style={styles.roleNameRow}>
                <GlassInput
                  label="Nom du rôle"
                  placeholder="Ex: Modérateur"
                  value={currentRole?.name || ''}
                  onChangeText={(text) => setCurrentRole(prev => prev ? { ...prev, name: text } : null)}
                  accentColor={currentRole?.color || theme.colors.technoBlue}
                  containerStyle={{ ...styles.inputContainer, flex: 1, marginRight: 10 }}
                />
                
                <TouchableOpacity 
                  style={[
                    styles.colorButton, 
                    { backgroundColor: currentRole?.color || theme.colors.technoBlue }
                  ]}
                  onPress={handleChangeColor}
                >
                  <Ionicons name="color-palette" size={20} color="white" />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.permissionsTitle, { color: theme.colors.textPrimary }]}>
                Permissions
              </Text>
              
              <View style={styles.permissionsList}>
                {availablePermissions.map((permission) => (
                  <TouchableOpacity
                    key={permission.id}
                    style={[
                      styles.permissionItem,
                      {
                        borderColor: currentRole?.permissions.includes(permission.id) 
                          ? currentRole.color 
                          : theme.colors.divider,
                        borderWidth: currentRole?.permissions.includes(permission.id) ? 2 : 1,
                        backgroundColor: currentRole?.permissions.includes(permission.id)
                          ? `${currentRole.color}20`
                          : 'transparent',
                      }
                    ]}
                    onPress={() => togglePermission(permission.id)}
                    disabled={role.isDefault && permission.id === 'manage_community'}
                  >
                    <View style={styles.permissionHeader}>
                      <Text style={{ 
                        color: currentRole?.permissions.includes(permission.id)
                          ? currentRole.color
                          : theme.colors.textPrimary,
                        fontWeight: '600'
                      }}>
                        {permission.name}
                      </Text>
                      
                      {currentRole?.permissions.includes(permission.id) && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={18} 
                          color={currentRole.color} 
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                    
                    <Text style={{ 
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                      marginTop: 4
                    }}>
                      {permission.description}
                    </Text>
                    
                    {role.isDefault && permission.id === 'manage_community' && (
                      <Text style={{ 
                        color: theme.colors.cyberPink,
                        fontSize: 12,
                        marginTop: 4,
                        fontStyle: 'italic'
                      }}>
                        Permission obligatoire pour le rôle par défaut
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.editButtons}>
                <NeoButton
                  title="Annuler"
                  onPress={() => {
                    if (role.isNew) {
                      setRoles(roles.filter(r => r.id !== role.id));
                    } else {
                      setRoles(roles.map(r => r.id === role.id ? { ...r, isEditing: false } : r));
                    }
                    setCurrentRole(null);
                  }}
                  variant="outline"
                  size="small"
                  accentColor={theme.colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
                
                <NeoButton
                  title="Enregistrer"
                  onPress={handleSaveRole}
                  size="small"
                  accentColor={currentRole?.color || theme.colors.technoBlue}
                />
              </View>
            </View>
          ) : (
            <View style={styles.roleContent}>
              <View style={styles.roleHeader}>
                <View style={styles.roleTitleContainer}>
                  <View style={[
                    styles.roleColorDot, 
                    { backgroundColor: role.color }
                  ]} />
                  
                  <Text style={[styles.roleTitle, { color: theme.colors.textPrimary }]}>
                    {role.name}
                  </Text>
                  
                  {role.isDefault && (
                    <View style={[
                      styles.defaultBadge,
                      { backgroundColor: theme.colors.background1 }
                    ]}>
                      <Text style={[styles.defaultText, { color: theme.colors.textSecondary }]}>
                        Par défaut
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.roleActions}>
                  <TouchableOpacity 
                    onPress={() => handleEditRole(role)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="pencil" size={18} color={theme.colors.technoBlue} />
                  </TouchableOpacity>
                  
                  {!role.isDefault && (
                    <TouchableOpacity 
                      onPress={() => handleDeleteRole(role.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-bin" size={18} color={theme.colors.neoRed} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.roleInfo}>
                <Text style={[styles.roleMemberCount, { color: theme.colors.textSecondary }]}>
                  {role.memberCount} membre{role.memberCount > 1 ? 's' : ''}
                </Text>
                
                <View style={styles.rolePermissionsContainer}>
                  {role.permissions.length > 0 ? (
                    <View style={styles.permissionChips}>
                      {role.permissions.map((permId) => {
                        const perm = availablePermissions.find(p => p.id === permId);
                        return perm ? (
                          <View 
                            key={permId}
                            style={[
                              styles.permissionChip, 
                              { 
                                backgroundColor: `${role.color}30`,
                                borderColor: `${role.color}60` 
                              }
                            ]}
                          >
                            <Text style={[styles.permissionChipText, { color: role.color }]}>
                              {perm.name}
                            </Text>
                          </View>
                        ) : null;
                      })}
                    </View>
                  ) : (
                    <Text style={[styles.noPermissions, { color: theme.colors.textSecondary }]}>
                      Aucune permission
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.manageMembers}>
                <NeoButton
                  title="Gérer les membres"
                  onPress={() => console.log(`Manage members with role ${role.id}`)}
                  variant="outline"
                  size="small"
                  accentColor={role.color}
                />
              </View>
            </View>
          )}
        </View>
      </BlurView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background1 }]}>
      <SettingsHeader title="Rôles" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
          </View>
        ) : (
          <>
            <SettingsSection
              title="Rôles et permissions"
              footer="Définissez les rôles et les permissions pour votre communauté"
            >
              <View style={styles.rolesContainer}>
                {roles.map((role) => <RoleItem key={role.id} role={role} />)}
                
                {!currentRole && (
                  <NeoButton
                    title="Créer un nouveau rôle"
                    onPress={handleAddRole}
                    variant="outline"
                    accentColor={theme.colors.technoBlue}
                    style={styles.addButton}
                  />
                )}
              </View>
            </SettingsSection>
            
            <View style={styles.buttonContainer}>
              <NeoButton 
                title="Enregistrer tous les rôles"
                onPress={handleSaveAllRoles}
                loading={saving}
                accentColor={theme.colors.technoBlue}
                style={styles.saveButton}
                disabled={!!currentRole}
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
  rolesContainer: {
    padding: 16,
  },
  roleItem: {
    overflow: 'hidden',
  },
  roleInner: {
    width: '100%',
    padding: 16,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 12,
  },
  roleActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  roleInfo: {
    marginBottom: 12,
  },
  roleMemberCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  rolePermissionsContainer: {
    marginTop: 4,
  },
  permissionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  permissionChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noPermissions: {
    fontStyle: 'italic',
    fontSize: 14,
  },
  manageMembers: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleContent: {
    width: '100%',
  },
  roleEditForm: {
    width: '100%',
  },
  roleNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    marginBottom: 8,
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionsList: {
    marginBottom: 16,
  },
  permissionItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  addButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  saveButton: {
    width: '100%',
  },
});