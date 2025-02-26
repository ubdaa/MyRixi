using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using MyRixiApi.Dto.Channel;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMapper _mapper;
    
    private readonly IMessageRepository _messageService;
    private readonly IChannelRepository _channelService;

    public MessageController(IMapper mapper,
        IMessageRepository messageService, 
        IChannelRepository channelService)
    {
        _mapper = mapper;
        _messageService = messageService;
        _channelService = channelService;
    }

    [HttpGet("channel/{channelId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetChannelMessages(
        Guid channelId, 
        [FromQuery] int pageSize = 20, 
        [FromQuery] int pageNumber = 1)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        var messages = await _messageService.GetChannelMessagesAsync(channelId, pageSize, pageNumber);
        
        return Ok(messages.Select(m => _mapper.Map<MessageDto>(m)));
    }

    [HttpPost("channel/{channelId}/send")]
    public async Task<ActionResult<MessageDto>> SendMessage(Guid channelId, [FromForm] CreateMessageDto messageDto)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        var newMessage = new Message
        {
            Content = messageDto.Content,
            ChannelId = channelId,
            SenderId = userId
        };
        
        // Si des pièces jointes sont incluses, les ajouter
        if (messageDto.AttachmentIds != null && messageDto.AttachmentIds.Any())
        {
            // Dans une vraie implémentation, nous devrions vérifier si ces medias existent
            // et appartiennent à l'utilisateur
            foreach (var attachmentId in messageDto.AttachmentIds)
            {
                newMessage.Attachments.Add(new Media { Id = attachmentId });
            }
        }
        
        var sentMessage = await _messageService.SendMessageAsync(newMessage);
        
        return CreatedAtAction(nameof(GetMessage), new { messageId = sentMessage.Id }, _mapper.Map<MessageDto>(sentMessage));
    }

    [HttpGet("{messageId}")]
    public async Task<ActionResult<MessageDto>> GetMessage(Guid messageId)
    {
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
            return NotFound();
            
        // Vérifier si l'utilisateur peut accéder à ce message
        var userId = GetCurrentUserId();
        var canAccess = await _channelService.UserCanAccessChannelAsync(message.ChannelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        return Ok(_mapper.Map<MessageDto>(message));
    }

    [HttpDelete("{messageId}")]
    public async Task<ActionResult> DeleteMessage(Guid messageId)
    {
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
            return NotFound();
            
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur est l'auteur du message
        if (message.SenderId != userId)
        {
            // TODO: Vérifier si l'utilisateur est modérateur/admin
            return Forbid();
        }
        
        await _messageService.DeleteMessageAsync(messageId);
        return NoContent();
    }

    [HttpPost("{messageId}/reaction")]
    public async Task<ActionResult> AddReaction(Guid messageId, ReactionRequestDto reactionDto)
    {
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
            return NotFound();
            
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce message
        var canAccess = await _channelService.UserCanAccessChannelAsync(message.ChannelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        await _messageService.AddReactionAsync(messageId, userId, reactionDto.Emoji);
        return Ok(new { Success = true });
    }

    [HttpDelete("{messageId}/reaction/{emoji}")]
    public async Task<ActionResult> RemoveReaction(Guid messageId, string emoji)
    {
        var message = await _messageService.GetMessageAsync(messageId);
        if (message == null)
            return NotFound();
            
        var userId = GetCurrentUserId();
        
        await _messageService.RemoveReactionAsync(messageId, userId, emoji);
        return NoContent();
    }

    [HttpPost("{channelId}/read")]
    public async Task<ActionResult> MarkAsRead(Guid channelId)
    {
        var userId = GetCurrentUserId();
        
        // Vérifier si l'utilisateur peut accéder à ce canal
        var canAccess = await _channelService.UserCanAccessChannelAsync(channelId, userId);
        if (!canAccess)
        {
            return Forbid();
        }
        
        await _messageService.MarkMessagesAsReadAsync(channelId, userId);
        return Ok(new { Success = true });
    }
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}