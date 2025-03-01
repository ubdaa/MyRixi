using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IChannelRepository : IGenericRepository<Channel>
{
    Task<IEnumerable<Channel>> GetCommunityChannelsAsync(Guid communityId);
    Task<IEnumerable<Channel>> GetUserCommunityChannelsAsync(Guid userId, Guid communityId);
    Task<IEnumerable<Channel>> GetPrivateChannelsForUserAsync(Guid userId);
    Task<Channel?> GetChannelWithMessagesAsync(Guid channelId, int pageSize, int pageNumber);
    Task AddUserToChannelAsync(Guid channelId, Guid userId);
    Task RemoveUserFromChannelAsync(Guid channelId, Guid userId);
    Task<Channel?> GetChannelDetailAsync(Guid channelId, int messagePageSize, int pageNumber);
    Task<Channel> CreateCommunityChannelAsync(Channel channel);
    Task<Channel?> CreateOrGetPrivateChannelAsync(Guid user1Id, Guid user2Id);
    Task UpdateChannelAsync(Channel channel);
    Task DeleteChannelAsync(Guid channelId);
    Task<bool> UserCanAccessChannelAsync(Guid channelId, Guid userId);
}