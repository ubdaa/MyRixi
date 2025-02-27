import { Channel, ChannelDetail, ChannelMessagesOptions, CreateChannelRequest, UpdateChannelRequest } from "@/types/channel";
import { apiDeleteRequest, apiGetRequest, apiPostRequest, apiPutRequest } from "./api";

/**
   * Récupère tous les canaux d'une communauté
   */
export async function getCommunityChannels(communityId: string): Promise<Channel[]> {
  return apiGetRequest<Channel[]>(`/Channel/community/${communityId}`, {});
}

/**
 * Récupère tous les canaux privés de l'utilisateur connecté
 */
export async function getMyPrivateChannels(): Promise<Channel[]> {
  return apiGetRequest<Channel[]>('/Channel/private', {});
}

/**
 * Récupère les détails d'un canal avec ses messages (paginés)
 */
export async function getChannelDetail(channelId: string, options: ChannelMessagesOptions = {}): Promise<ChannelDetail> {
  const { pageSize = 20, pageNumber = 1 } = options;
  return apiGetRequest<ChannelDetail>(`/Channel/${channelId}`, {
    params: { pageSize, pageNumber }
  });
}

/**
 * Crée un nouveau canal dans une communauté
 */
export async function createCommunityChannel(communityId: string, channel: CreateChannelRequest): Promise<Channel> {
  const formData = new FormData();
  formData.append('name', channel.name);
  formData.append('description', channel.description);
  formData.append('isPrivate', String(channel.isPrivate));
  
  return apiPostRequest<Channel>(`/Channel/community/${communityId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Crée ou récupère un canal privé avec un utilisateur
 */
export async function createOrGetPrivateChannel(userId: string): Promise<Channel> {
  return apiPostRequest<Channel>(`/Channel/private/${userId}`, new FormData(), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Met à jour les informations d'un canal
 */
export async function updateChannel(channelId: string, channel: UpdateChannelRequest): Promise<void> {
  const formData = new FormData();
  formData.append('name', channel.name);
  formData.append('description', channel.description);
  formData.append('isPrivate', String(channel.isPrivate));
  
  await apiPutRequest<void>(`/Channel/${channelId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Supprime un canal
 */
export async function deleteChannel(channelId: string): Promise<void> {
  await apiDeleteRequest<void>(`/Channel/${channelId}`, {});
}