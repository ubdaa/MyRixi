using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class ChannelRepository : GenericRepository<Channel>, IChannelRepository
{
    public ChannelRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Channel>> GetAllAsync()
    {
        return await _context.Channels
            .Include(c => c.Community)
            .ToListAsync();
    }

    public override async Task<Channel?> GetByIdAsync(Guid id)
    {
        return await _context.Channels
            .Include(c => c.Community)
            .Include(c => c.Participants)
            .Include(c => c.AllowedMembers)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Channel>> GetCommunityChannelsAsync(Guid communityId)
    {
        return await _context.Channels
            .Where(c => c.CommunityId == communityId)
            .Include(c => c.AllowedMembers)
            .ToListAsync();
    }

    public Task<IEnumerable<Channel>> GetUserCommunityChannelsAsync(Guid userId)
    {
        return Task.FromResult(_context.Channels
            .Where(c => c.Type == ChatType.CommunityChannel && c.AllowedMembers.Any(u => u.UserId == userId))
            .Include(c => c.AllowedMembers)
            .ToList() as IEnumerable<Channel>);
    }

    public Task<IEnumerable<Channel>> GetUserCommunityChannelsAsync(Guid userId, Guid communityId)
    {
        return Task.FromResult(_context.Channels
            .Where(c => c.CommunityId == communityId && c.AllowedMembers.Any(u => u.UserId == userId))
            .Include(c => c.AllowedMembers)
            .ToList() as IEnumerable<Channel>);
    }

    public async Task<IEnumerable<Channel>> GetPrivateChannelsForUserAsync(Guid userId)
    {
        return await _context.Channels
            .Where(c => c.Type == ChatType.PrivateMessage && c.Participants.Any(p => p.Id == userId))
            .Include(c => c.Participants)
            .ToListAsync();
    }

    public async Task<Channel?> GetChannelWithMessagesAsync(Guid channelId, int pageSize, int pageNumber)
    {
        return await _context.Channels
            .Include(c => c.Messages
                .OrderByDescending(m => m.SentAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize))
            .ThenInclude(m => m.Sender)
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == channelId);
    }

    public async Task<Channel> CreateCommunityChannelAsync(Channel channel)
    {
        await _context.Channels.AddAsync(channel);
        await _context.SaveChangesAsync();
        return channel;
    }

    public async Task<Channel?> CreateOrGetPrivateChannelAsync(Guid user1Id, Guid user2Id)
    {
        // Chercher un canal privé existant entre ces deux utilisateurs
        var existingChannel = await _context.Channels
            .Include(c => c.Participants)
            .Where(c => c.Type == ChatType.PrivateMessage && 
                   c.Participants.Count() == 2 && 
                   c.Participants.Any(p => p.Id == user1Id) && 
                   c.Participants.Any(p => p.Id == user2Id))
            .FirstOrDefaultAsync();

        if (existingChannel != null)
            return existingChannel;

        // Créer un nouveau canal privé
        var user1 = await _context.Users.FindAsync(user1Id);
        var user2 = await _context.Users.FindAsync(user2Id);

        if (user1 == null || user2 == null)
            return null;

        var newChannel = new Channel
        {
            Type = ChatType.PrivateMessage,
            Name = $"Chat entre {user1.UserName} et {user2.UserName}",
            IsPrivate = true
        };

        newChannel.Participants.Add(user1);
        newChannel.Participants.Add(user2);

        await _context.Channels.AddAsync(newChannel);
        await _context.SaveChangesAsync();

        return newChannel;
    }

    public async Task UpdateChannelAsync(Channel channel)
    {
        await UpdateAsync(channel);
    }

    public async Task DeleteChannelAsync(Guid channelId)
    {
        await DeleteAsync(channelId);
    }

    public Task<bool> UserCanAccessChannelAsync(Guid channelId, Guid userId)
    {
        var channel = _context.Channels
            .Include(c => c.Participants)
            .FirstOrDefault(c => c.Id == channelId);
        
        return Task.FromResult(channel != null && channel.Participants.Any(p => p.Id == userId));
    }

    public async Task AddUserToChannelAsync(Guid channelId, Guid userId)
    {
        var channel = await _context.Channels
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == channelId);
        
        var user = await _context.Users.FindAsync(userId);

        if (channel != null && user != null && !channel.Participants.Any(p => p.Id == userId))
        {
            channel.Participants.Add(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveUserFromChannelAsync(Guid channelId, Guid userId)
    {
        var channel = await _context.Channels
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == channelId);

        if (channel != null)
        {
            var user = channel.Participants.FirstOrDefault(p => p.Id == userId);
            if (user != null)
            {
                channel.Participants.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task<Channel?> GetChannelDetailAsync(Guid channelId, int messagePageSize, int pageNumber)
    {
        return await _context.Channels
            .Include(c => c.Messages
                .OrderByDescending(m => m.SentAt)
                .Skip((pageNumber - 1) * messagePageSize)
                .Take(messagePageSize))
            .ThenInclude(m => m.Sender)
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == channelId);
    }
}