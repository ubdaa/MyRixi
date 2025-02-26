using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace MyRixiApi.Controllers;

[Authorize]
[ApiController]
[Route("v1/[controller]")]
public class ChannelController : ControllerBase
{
    private readonly IMapper _mapper;
    
    private readonly IChannelRepository _channelService;
    private readonly IMessageRepository _messageService;

    public ChannelController(IMapper mapper,
        IChannelRepository channelService, 
        IMessageRepository messageService)
    {
        _mapper = mapper;
        _channelService = channelService;
        _messageService = messageService;
    }

    [HttpGet("community/{communityId}")]
    public async Task<ActionResult<IEnumerable<ChannelDto>>> GetCommunityChannels(Guid communityId)
    {
        var channels = await _channelService.GetCommunityChannelsAsync(communityId);
        return Ok(channels.Select(c => _mapper.Map<ChannelDto>(c)));
    }

    [HttpGet("private")]
    public async Task<ActionResult<IEnumerable<ChannelDto>>> GetMyPrivateChannels()
    {
        var userId = GetCurrentUserId();
        var channels = await _channelService.GetPrivateChannelsForUserAsync(userId);
        return Ok(channels.Select(c => _mapper.Map<ChannelDto>(c)));
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
            
        return Ok(_mapper.Map<ChannelDetailDto>(channel));
    }

    [HttpPost("community/{communityId}")]
    public async Task<ActionResult<ChannelDto>> CreateCommunityChannel(Guid communityId, [FromForm] CreateChannelDto channelDto)
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
        return CreatedAtAction(nameof(GetChannelDetail), new { channelId = createdChannel.Id }, _mapper.Map<ChannelDto>(createdChannel));
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
            
        return Ok(_mapper.Map<ChannelDto>(channel));
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
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}