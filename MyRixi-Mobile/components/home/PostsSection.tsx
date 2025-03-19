import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { PostCard } from './PostCard';

interface PostsSectionProps {
  posts: Array<{
    id: string;
    author: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
  }>;
}

export const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title="Fil d'actualité" />
      
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    marginBottom: 100,
    paddingHorizontal: 20,
  },
});
