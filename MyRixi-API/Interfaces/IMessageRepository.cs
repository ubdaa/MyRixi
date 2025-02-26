using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<IEnumerable<Message>> GetChannelMessagesAsync(Guid channelId, int pageSize, int pageNumber);
    Task<int> GetUnreadMessageCountAsync(Guid channelId, Guid userId);
    Task MarkMessagesAsReadAsync(Guid channelId, Guid userId);
    Task<IEnumerable<Message>> SearchMessagesAsync(Guid channelId, string searchTerm);
}