namespace MyRixiApi.Dto.Channel;

// DTOs pour les canaux
public class ChannelDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
    public string Type { get; set; } = "CommunityChannel";
    public Guid? CommunityId { get; set; }
    public int ParticipantCount { get; set; }
    public int UnreadCount { get; set; } = 0;
    public MessageDto? LastMessage { get; set; }
}
