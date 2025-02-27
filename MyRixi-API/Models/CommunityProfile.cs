namespace MyRixiApi.Models;

public enum JoinStatus
{
    Pending,
    Accepted,
    Rejected,
    Left
}

public class CommunityProfile
{
    public Guid Id { get; set; }
    public string Pseudonym { get; set; } = string.Empty;
    public string Role { get; set; } = "Membre"; // Membre, Modérateur, Admin
    public string Preferences { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsSuspended { get; set; } = false;
    public bool IsBanned { get; set; } = false;
    
    public bool IsOwner { get; set; } = false;
    
    public JoinStatus JoinStatus { get; set; } = JoinStatus.Pending;
    
    // images for profile and cover
    public Guid ProfilePictureId { get; set; }
    public Media ProfilePicture { get; set; } = null!;
    
    public Guid CoverPictureId { get; set; }
    public Media CoverPicture { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}