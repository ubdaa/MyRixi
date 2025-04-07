namespace MyRixiApi.Models;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public Guid? CommunityId { get; set; }
    public Community? Community { get; set; }
    
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
}