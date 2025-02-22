namespace MyRixiApi.Models;

public class Attachment
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty; // image, video, audio
    public string Url { get; set; } = string.Empty;
    public string Metadata { get; set; } = string.Empty;
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
    public Guid? CommentId { get; set; }
    public Comment? Comment { get; set; }
}