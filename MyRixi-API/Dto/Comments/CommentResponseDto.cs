namespace MyRixiApi.Dto.Comments;

public class CommentResponseDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime PostedAt { get; set; }
    public Guid? ParentCommentId { get; set; }
    public Guid? PostId { get; set; }
    public Guid? ProfileId { get; set; }
    public string? ProfileName { get; set; } // Si vous souhaitez inclure des infos du profil
    public List<CommentResponseDto> Replies { get; set; } = new();
}