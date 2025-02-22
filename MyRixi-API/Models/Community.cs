namespace MyRixiApi.Models;

public class Community
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Rules { get; set; } = string.Empty;
    public string BannerImage { get; set; } = string.Empty;
    public ICollection<CommunityProfile> Members { get; set; } = new List<CommunityProfile>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}