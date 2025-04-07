import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Tag {
  id: string;
  description: string;
}

interface Attachment {
  id: string;
  media: {
    url: string;
  };
}

interface PostContentProps {
  title?: string;
  content: string;
  attachments?: Attachment[];
  tags?: Tag[];
  compact?: boolean;
}

export function PostContent({ 
  title, 
  content,
  attachments = [],
  tags = [],
  compact = false
}: PostContentProps) {
  const { theme } = useTheme();
  
  // Truncate content to 256 characters when in compact mode
  const displayContent = compact && content.length > 256
    ? `${content.substring(0, 256)}...`
    : content;

  return (
    <View>
      {title && (
        <Text style={[
          styles.postTitle, 
          { color: theme.colors.textPrimary },
          compact ? styles.postTitleCompact : {}
        ]}>
          {title}
        </Text>
      )}

      <Text style={[
        styles.postContent, 
        { color: theme.colors.textPrimary },
        compact ? styles.postContentCompact : {}
      ]}>
        {displayContent}
      </Text>

      {attachments.length > 0 && (
        <ScrollView 
          horizontal={attachments.length > 1}
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContentContainer}
        >
          {attachments.map((attachment) => (
            <View key={attachment.id} style={styles.imageWrapper}>
              <Image 
                source={{ uri: attachment.media.url }} 
                style={compact ? styles.imageCompact : styles.image} 
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      )}

      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map(tag => (
            <View 
              key={tag.id} 
              style={[
                styles.tag, 
                { 
                  backgroundColor: theme.colors.technoBlue + '20', 
                  borderColor: theme.colors.technoBlue 
                }
              ]}
            >
              <Text style={[
                styles.tagText, 
                { color: theme.colors.technoBlue }
              ]}>
                {tag.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  postTitleCompact: {
    fontSize: 17,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  postContentCompact: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagesContentContainer: {
    paddingRight: 12,
  },
  imageWrapper: {
    marginRight: 8,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: 8,
  },
  imageCompact: {
    width: 240,
    height: 160,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
