import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type CommunityCoverProps = {
  coverUrl: string;
  height?: number;
  style?: object;
};

export function CommunityCover({ 
  coverUrl, 
  height = 100, 
  style = {} 
}: CommunityCoverProps) {
  // Construire l'URL complète si nécessaire
  const fullCoverUrl = coverUrl.startsWith('http') ? 
    coverUrl : 
    `https://minio-ysskscsocw084wok808w04wo.109.199.107.134.sslip.io/${coverUrl}`;

  return (
    <Image
      source={fullCoverUrl}
      style={[styles.cover, { height }, style]}
      contentFit="cover"
      placeholder="L184i9ofbHof00ayjof~qj[ayj@"
    />
  );
};

const styles = StyleSheet.create({
  cover: {
    width: '100%',
  },
});