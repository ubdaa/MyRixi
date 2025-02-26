namespace MyRixiApi.Dto.Channel;

public class CreateMessageDto
{
    public string Content { get; set; } = string.Empty;
    public Guid ChannelId { get; set; }
    public List<Guid>? AttachmentIds { get; set; }
}