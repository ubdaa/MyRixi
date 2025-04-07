namespace MyRixiApi.Models;

public enum PostState
{
    Draft,
    Published,
    Archived
}

public enum PostType
{
    Text
}

public class Post
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public PostState State { get; set; } = PostState.Draft;
    public PostType Type { get; set; } = PostType.Text;
    
    // Relationships
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    public Guid CommunityProfileId { get; set; }
    public CommunityProfile CommunityProfile { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public virtual ICollection<Like> Likes { get; set; } = new HashSet<Like>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}

public class Like
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual Post Post { get; set; }
    public virtual User User { get; set; }
}