using MyRixiApi.Dto.Media;

namespace MyRixiApi.Dto.Channel;

public class MessageDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public Guid ChannelId { get; set; }
    public ChannelDto Channel { get; set; } = null!;
    public UserChannelDto Sender { get; set; } = null!;
    public List<MediaDto> Attachments { get; set; } = new List<MediaDto>();
    public List<ReactionDto> Reactions { get; set; } = new List<ReactionDto>();
}