using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
using System.Security.Claims;
using AutoMapper;

namespace MyRixiApi.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageRepository _messageService;
    private readonly IChannelRepository _channelService;
    private readonly IUserConnectionManager _connectionManager;
    private readonly IMapper _mapper;

    public ChatHub(
        IMessageRepository messageService,
        IChannelRepository channelService,
        IUserConnectionManager connectionManager,
        IMapper mapper)
    {
        _messageService = messageService;
        _channelService = channelService;
        _connectionManager = connectionManager;
        _mapper = mapper;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetCurrentUserId();
        var connectionId = Context.ConnectionId;

        // Récupération du paramètre depuis l'URL
        var communityIdQuery = Context.GetHttpContext()?.Request.Query["communityId"];
        if (!Guid.TryParse(communityIdQuery, out var communityId))
        {
            throw new HubException("ID de communauté invalide");
        }

        _connectionManager.AddConnection(userId, connectionId);

        // Récupérer tous les canaux de l'utilisateur
        var communityChannels = await _channelService.GetUserCommunityChannelsAsync(userId);
        var privateChannels = await _channelService.GetPrivateChannelsForUserAsync(userId);

        var allChannels = communityChannels.Concat(privateChannels);
    
        foreach (var channel in allChannels)
        {
            await Groups.AddToGroupAsync(connectionId, channel.Id.ToString());
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetCurrentUserId();
        _connectionManager.RemoveConnection(userId, Context.ConnectionId);
        
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(Guid channelId)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            throw new HubException("Vous n'avez pas accès à ce canal");
        }
        
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId.ToString());
        
        // Marquer les messages comme lus
        await _messageService.MarkMessagesAsReadAsync(channelId, userId);
        
        // Notifier les autres utilisateurs que quelqu'un a rejoint le canal
        await Clients.Group(channelId.ToString()).SendAsync("UserJoinedChannel", new { UserId = userId, ChannelId = channelId });
    }

    public async Task LeaveChannel(Guid channelId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId.ToString());
        
        var userId = GetCurrentUserId();
        
        // Notifier les autres utilisateurs que quelqu'un a quitté le canal
        await Clients.Group(channelId.ToString()).SendAsync("UserLeftChannel", new { UserId = userId, ChannelId = channelId });
    }

    public async Task SendMessage(CreateMessageDto messageDto)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(messageDto.ChannelId, userId);
        if (!canAccess)
        {
            throw new HubException("Vous n'avez pas accès à ce canal");
        }
        
        var newMessage = new Message
        {
            Content = messageDto.Content,
            ChannelId = messageDto.ChannelId,
            SenderId = userId,
            SentAt = DateTime.UtcNow
        };
        
        // Si des pièces jointes sont incluses, les ajouter
        if (messageDto.AttachmentIds != null && messageDto.AttachmentIds.Any())
        {
            foreach (var attachmentId in messageDto.AttachmentIds)
            {
                newMessage.Attachments.Add(new Media { Id = attachmentId });
            }
        }
        
        var sentMessage = await _messageService.SendMessageAsync(newMessage);
        //messageDto = _mapper.Map<MessageDto>(sentMessage);
        
        // Envoyer le message à tous les utilisateurs du canal
        await Clients.Group(messageDto.ChannelId.ToString()).SendAsync("ReceiveMessage", messageDto);
    }

    public async Task AddReaction(Guid messageId, string emoji)
    {
        var userId = GetCurrentUserId();
        
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
        {
            throw new HubException("Message non trouvé");
        }
        
        // Vérifier si l'utilisateur peut accéder à ce message
        var canAccess = await _channelService.UserCanAccessChannelAsync(message.ChannelId, userId);
        if (!canAccess)
        {
            throw new HubException("Vous n'avez pas accès à ce message");
        }
        
        await _messageService.AddReactionAsync(messageId, userId, emoji);
        
        // Récupérer le message mis à jour avec la nouvelle réaction
        var updatedMessage = await _messageService.GetMessageAsync(messageId);
        var updatedReactions = _mapper.Map<List<ReactionDto>>(updatedMessage?.Reactions);
        
        // Notifier tous les utilisateurs du canal de la nouvelle réaction
        await Clients.Group(message.ChannelId.ToString()).SendAsync("MessageReactionUpdated", messageId, updatedReactions);
    }

    public async Task RemoveReaction(Guid messageId, string emoji)
    {
        var userId = GetCurrentUserId();
        
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
        {
            throw new HubException("Message non trouvé");
        }
        
        await _messageService.RemoveReactionAsync(messageId, userId, emoji);
        
        // Récupérer le message mis à jour
        var updatedMessage = await _messageService.GetMessageAsync(messageId);
        var updatedReactions = _mapper.Map<List<ReactionDto>>(updatedMessage?.Reactions);
        
        // Notifier tous les utilisateurs du canal
        await Clients.Group(message.ChannelId.ToString()).SendAsync("MessageReactionUpdated", messageId, updatedReactions);
    }

    /*public async Task StartTyping(Guid channelId)
    {
        var userId = GetCurrentUserId();
        var user = await _connectionManager.GetUserInfoAsync(userId);
        
        // Notifier tous les utilisateurs du canal sauf l'expéditeur
        await Clients.OthersInGroup(channelId.ToString()).SendAsync("UserTyping", channelId, user);
    }*/

    public async Task StopTyping(Guid channelId)
    {
        var userId = GetCurrentUserId();
        
        // Notifier tous les utilisateurs du canal sauf l'expéditeur
        await Clients.OthersInGroup(channelId.ToString()).SendAsync("UserStoppedTyping", channelId, userId);
    }

    public async Task MarkAsRead(Guid channelId)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            throw new HubException("Vous n'avez pas accès à ce canal");
        }
        
        await _messageService.MarkMessagesAsReadAsync(channelId, userId);
        
        // On pourrait notifier l'utilisateur que les messages ont été lus
        await Clients.Caller.SendAsync("MessagesMarkedAsRead", channelId);
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}