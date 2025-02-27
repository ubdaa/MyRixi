namespace MyRixiApi.Models;

public class UserProfile
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; } = DateTime.Now;
    
    public Guid ProfilePictureId { get; set; }
    public Media ProfilePicture { get; set; } = null!;
    
    public Guid CoverPictureId { get; set; }
    public Media CoverPicture { get; set; } = null!;
    
    public Guid UserId { get; set; }  // Doit être de type Guid
    public User User { get; set; } = null!;
}