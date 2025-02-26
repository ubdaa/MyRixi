using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IChannelRepository : IGenericRepository<Channel>
{
    Task<IEnumerable<Channel>> GetCommunityChannelsAsync(Guid communityId);
    Task<IEnumerable<Channel>> GetPrivateChannelsForUserAsync(Guid userId);
    Task<Channel?> GetChannelWithMessagesAsync(Guid channelId, int pageSize, int pageNumber);
    Task<Channel?> GetOrCreatePrivateChannelAsync(Guid user1Id, Guid user2Id);
    Task AddUserToChannelAsync(Guid channelId, Guid userId);
    Task RemoveUserFromChannelAsync(Guid channelId, Guid userId);
}