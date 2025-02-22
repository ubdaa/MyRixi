namespace MyRixiApi.Models;

public class Attachment
{
    public Guid Id { get; set; }
    public Guid MediaId { get; set; }
    public Media Media { get; set; } = null!;
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
    public Guid? CommentId { get; set; }
    public Comment? Comment { get; set; }
}