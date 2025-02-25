import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type CommunityAvatarProps = {
  iconUrl: string;
  size?: number;
  style?: object;
};

export function CommunityAvatar({ 
  iconUrl, 
  size = 60, 
  style = {} 
}: CommunityAvatarProps) {
  // Construire l'URL complète si nécessaire (selon votre backend)
  const fullIconUrl = iconUrl.startsWith('http') ? 
    iconUrl : 
    `https://minio-ysskscsocw084wok808w04wo.109.199.107.134.sslip.io/${iconUrl}`;

  return (
    <Image
      source={fullIconUrl}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      contentFit="cover"
      placeholder="L184i9ofbHof00ayjof~qj[ayj@"
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
  },
});