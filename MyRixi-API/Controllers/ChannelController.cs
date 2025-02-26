using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;

using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChannelController : ControllerBase
{
    private readonly IChannelRepository _channelService;
    private readonly IMessageRepository _messageService;

    public ChannelController(IChannelRepository channelService, 
        IMessageRepository messageService)
    {
        _channelService = channelService;
        _messageService = messageService;
    }

    [HttpGet("community/{communityId}")]
    public async Task<ActionResult<IEnumerable<ChannelDto>>> GetCommunityChannels(Guid communityId)
    {
        var channels = await _channelService.GetCommunityChannelsAsync(communityId);
        return Ok(channels.Select(c => MapChannelToDto(c)));
    }

    [HttpGet("private")]
    public async Task<ActionResult<IEnumerable<ChannelDto>>> GetMyPrivateChannels()
    {
        var userId = GetCurrentUserId();
        var channels = await _channelService.GetPrivateChannelsForUserAsync(userId);
        return Ok(channels.Select(c => MapChannelToDto(c)));
    }

    [HttpGet("{channelId}")]
    public async Task<ActionResult<ChannelDetailDto>> GetChannelDetail(Guid channelId, [FromQuery] int pageSize = 20, [FromQuery] int pageNumber = 1)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        var channel = await _channelService.GetChannelDetailAsync(channelId, pageSize, pageNumber);
        if (channel == null)
            return NotFound();
            
        // Marquer les messages comme lus
        await _messageService.MarkMessagesAsReadAsync(channelId, userId);
            
        return Ok(MapChannelToDetailDto(channel));
    }

    [HttpPost("community/{communityId}")]
    public async Task<ActionResult<ChannelDto>> CreateCommunityChannel(Guid communityId, CreateChannelDto channelDto)
    {
        // TODO: Vérifier si l'utilisateur a les droits suffisants dans la communauté
        
        var newChannel = new Channel
        {
            Name = channelDto.Name,
            Description = channelDto.Description,
            IsPrivate = channelDto.IsPrivate,
            Type = ChatType.CommunityChannel,
            CommunityId = communityId
        };
        
        var createdChannel = await _channelService.CreateCommunityChannelAsync(newChannel);
        return CreatedAtAction(nameof(GetChannelDetail), new { channelId = createdChannel.Id }, MapChannelToDto(createdChannel));
    }
    
    [HttpPost("private/{userId}")]
    public async Task<ActionResult<ChannelDto>> CreateOrGetPrivateChannel(Guid userId)
    {
        var currentUserId = GetCurrentUserId();
        
        if (userId == currentUserId)
            return BadRequest("Vous ne pouvez pas créer un chat privé avec vous-même");
            
        var channel = await _channelService.CreateOrGetPrivateChannelAsync(currentUserId, userId);
        if (channel == null)
            return NotFound("Utilisateur introuvable");
            
        return Ok(MapChannelToDto(channel));
    }
    
    [HttpPut("{channelId}")]
    public async Task<ActionResult> UpdateChannel(Guid channelId, UpdateChannelDto channelDto)
    {
        // TODO: Vérifier si l'utilisateur a les droits suffisants
        
        var existingChannel = await _channelService.GetChannelDetailAsync(channelId, 1, 1);
        if (existingChannel == null)
            return NotFound();
            
        existingChannel.Name = channelDto.Name;
        existingChannel.Description = channelDto.Description;
        existingChannel.IsPrivate = channelDto.IsPrivate;
        
        await _channelService.UpdateChannelAsync(existingChannel);
        return NoContent();
    }
    
    [HttpDelete("{channelId}")]
    public async Task<ActionResult> DeleteChannel(Guid channelId)
    {
        // TODO: Vérifier si l'utilisateur a les droits suffisants
        
        await _channelService.DeleteChannelAsync(channelId);
        return NoContent();
    }
    
    // Méthodes privées pour mapper les entités vers les DTOs
    private ChannelDto MapChannelToDto(Channel channel)
    {
        return new ChannelDto
        {
            Id = channel.Id,
            Name = channel.Name,
            Description = channel.Description,
            IsPrivate = channel.IsPrivate,
            Type = channel.Type.ToString(),
            CommunityId = channel.CommunityId,
            ParticipantCount = channel.Participants.Count
        };
    }
    
    private ChannelDetailDto MapChannelToDetailDto(Channel channel)
    {
        return new ChannelDetailDto
        {
            Id = channel.Id,
            Name = channel.Name,
            Description = channel.Description,
            IsPrivate = channel.IsPrivate,
            Type = channel.Type.ToString(),
            CommunityId = channel.CommunityId,
            Participants = channel.Participants.Select(p => new UserChannelDto 
            { 
                Id = p.Id,
                UserName = p.UserName,
                Avatar = p.Avatar
            }).ToList(),
            Messages = channel.Messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                SentAt = m.SentAt,
                IsRead = m.IsRead,
                Sender = new UserChannelDto
                {
                    Id = m.Sender.Id,
                    UserName = m.Sender.UserName,
                    Avatar = m.Sender.Avatar
                },
                Attachments = m.Attachments.Select(a => new MediaDto
                {
                    Id = a.Id,
                    Type = a.Type,
                    Url = a.Url
                }).ToList(),
                // bien rajouter les réactions des utilisateurs
                Reactions = m.Reactions.GroupBy(r => r.Emoji)
                    .Select(g => new ReactionDto
                    {
                        Emoji = g.Key,
                        Count = g.Count(),
                        Users = g.SelectMany(mr => mr.Users.Select(u => u.Id)).ToList()
                    }).ToList()
            }).ToList()
        };
    }
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}