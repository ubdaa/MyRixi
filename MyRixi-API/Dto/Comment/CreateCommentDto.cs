namespace MyRixiApi.Dto.Comment;

public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}