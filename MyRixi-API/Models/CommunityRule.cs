namespace MyRixiApi.Models;

public class CommunityRule
{
    public Guid Id { get; set; }
    public Guid CommunityId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Order { get; set; }
    public Community Community { get; set; } = null!;
}