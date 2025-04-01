using MyRixiApi.Dto.Attachments;
using MyRixiApi.Dto.Comments;
using MyRixiApi.Dto.Tags;
using MyRixiApi.Models;

namespace MyRixiApi.Dto.Posts;

public class PostResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public PostType PostType { get; set; }
    public List<TagResponseDto> Tags { get; set; } = new();
    public List<AttachmentResponseDto> Attachments { get; set; } = new();
    public List<CommentResponseDto> Comments { get; set; } = new();
}