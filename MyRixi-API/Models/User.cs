using Microsoft.AspNetCore.Identity;

namespace MyRixiApi.Models;

public class User : IdentityUser<Guid>
{
    public string Avatar { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public bool IsPrivate { get; set; }
    public ICollection<CommunityProfile> CommunityProfiles { get; set; } = new List<CommunityProfile>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public UserProfile UserProfile { get; set; } = null!;
}