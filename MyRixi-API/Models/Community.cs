namespace MyRixiApi.Models;

public class Community
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
    public bool IsInviteOnly { get; set; } = false;
    
    public Guid IconId { get; set; }
    public Media Icon { get; set; } = null!;
    
    public Guid CoverId { get; set; }
    public Media Cover { get; set; } = null!;
    
    public Guid OwnerId { get; set; }
    public CommunityProfile Owner { get; set; } = null!;
    
    public ICollection<CommunityRule> Rules { get; set; } = new List<CommunityRule>();
    public ICollection<CommunityProfile> Members { get; set; } = new List<CommunityProfile>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}