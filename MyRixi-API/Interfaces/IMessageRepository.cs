using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<IEnumerable<Message>> GetChannelMessagesAsync(Guid channelId, int pageSize, int pageNumber);
    Task<int> GetUnreadMessageCountAsync(Guid channelId, Guid userId);
    Task MarkMessagesAsReadAsync(Guid channelId, Guid userId);
    Task<IEnumerable<Message>> SearchMessagesAsync(Guid channelId, string searchTerm);
    Task<Message> SendMessageAsync(Message message);
    Task<Message?> GetMessageAsync(Guid messageId);
    Task DeleteMessageAsync(Guid messageId);
    Task<MessageReaction> AddReactionAsync(Guid messageId, Guid userId, string emoji);
    Task RemoveReactionAsync(Guid messageId, Guid userId, string emoji);
}