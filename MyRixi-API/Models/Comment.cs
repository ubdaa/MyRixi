namespace MyRixiApi.Models;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
    public Guid? ProfileId { get; set; }
    public MainProfile? Profile { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}