using MyRixiApi.Dto.Media;

namespace MyRixiApi.Dto.Attachments;

public class AttachmentResponseDto
{
    public Guid Id { get; set; }
    public Guid MediaId { get; set; }
    public MediaDto Media { get; set; } = null!;
}