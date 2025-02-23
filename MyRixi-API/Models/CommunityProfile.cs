namespace MyRixiApi.Models;

public class CommunityProfile
{
    public Guid Id { get; set; }
    public string Pseudonym { get; set; } = string.Empty;
    public string Role { get; set; } = "Membre"; // Membre, Modérateur, Admin
    public string Preferences { get; set; } = string.Empty;
    
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