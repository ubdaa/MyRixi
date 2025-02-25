namespace MyRixiApi.Dto.Community;

public class CommuntiyProfileResponseDto
{
    public Guid Id { get; set; }
    public string Pseudonym { get; set; } = string.Empty;
    public string Role { get; set; } = "Membre";
    public string Description { get; set; } = string.Empty;
    
    public bool IsSuspended { get; set; } = false;
    public bool IsBanned { get; set; } = false;
    
    public string JoinStatus { get; set; } = "Pending";
    
    public string ProfilePictureUrl { get; set; } = string.Empty;
    public string CoverPictureUrl { get; set; } = string.Empty;
    
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    
    public Guid CommunityId { get; set; }
    public string CommunityName { get; set; } = string.Empty;
    
    public int CommentsCount { get; set; }
}