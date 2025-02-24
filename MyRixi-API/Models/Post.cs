namespace MyRixiApi.Models;

public class Post
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public string Type { get; set; } = "text"; // text, multimedia
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    public Guid CommunityProfileId { get; set; }
    public CommunityProfile CommunityProfile { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
