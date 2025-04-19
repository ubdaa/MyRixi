namespace MyRixiApi.Dto.Comment;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime PostedAt { get; set; }
    public Guid? ParentCommentId { get; set; }
    public Guid? PostId { get; set; }
    public Guid ProfileId { get; set; }
    public string ProfileDisplayName { get; set; } = string.Empty;
    public string ProfilePictureUrl { get; set; } = string.Empty;
    public int RepliesCount { get; set; }
    public bool IsOwner { get; set; }
}