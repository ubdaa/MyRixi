import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

type EmptyCommunitiesListProps = {
  onRefresh: () => void;
};

export function EmptyCommunitiesList({ onRefresh }: EmptyCommunitiesListProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="people" size={60} color="#ccc" />
      <Text style={styles.title}>No communities yet</Text>
      <Text style={styles.subtitle}>
        Join or create a community to connect with others
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={20} color="#4c669f" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
        
        <Link href="/community/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createText}>Create Community</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#4c669f',
    borderRadius: 20,
    marginRight: 10,
  },
  refreshText: {
    color: '#4c669f',
    marginLeft: 5,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 20,
  },
  createText: {
    color: '#fff',
    marginLeft: 5,
  },
});