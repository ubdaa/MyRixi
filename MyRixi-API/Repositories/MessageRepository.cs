using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;


public class MessageRepository : GenericRepository<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Message?> GetByIdAsync(Guid id)
    {
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Channel)
            .Include(m => m.Attachments)
            .Include(m => m.Reactions)
                .ThenInclude(r => r.Users)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<IEnumerable<Message>> GetChannelMessagesAsync(Guid channelId, int pageSize, int pageNumber)
    {
        return await _context.Messages
            .Where(m => m.ChannelId == channelId)
            .OrderByDescending(m => m.SentAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Include(m => m.Sender)
            .Include(m => m.Attachments)
            .Include(m => m.Reactions)
                .ThenInclude(r => r.Users)
            .ToListAsync();
    }

    public async Task<int> GetUnreadMessageCountAsync(Guid channelId, Guid userId)
    {
        return await _context.Messages
            .CountAsync(m => m.ChannelId == channelId && 
                       m.SenderId != userId && 
                       !m.IsRead);
    }

    public async Task MarkMessagesAsReadAsync(Guid channelId, Guid userId)
    {
        var messages = await _context.Messages
            .Where(m => m.ChannelId == channelId && 
                   m.SenderId != userId && 
                   !m.IsRead)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Message>> SearchMessagesAsync(Guid channelId, string searchTerm)
    {
        return await _context.Messages
            .Where(m => m.ChannelId == channelId && 
                   m.Content.Contains(searchTerm))
            .Include(m => m.Sender)
            .OrderByDescending(m => m.SentAt)
            .ToListAsync();
    }

    public Task<Message> SendMessageAsync(Message message)
    {
        throw new NotImplementedException();
    }

    public Task<Message?> GetMessageAsync(Guid messageId)
    {
        throw new NotImplementedException();
    }

    public Task DeleteMessageAsync(Guid messageId)
    {
        throw new NotImplementedException();
    }

    public Task<MessageReaction> AddReactionAsync(Guid messageId, Guid userId, string emoji)
    {
        throw new NotImplementedException();
    }

    public Task RemoveReactionAsync(Guid messageId, Guid userId, string emoji)
    {
        throw new NotImplementedException();
    }
}