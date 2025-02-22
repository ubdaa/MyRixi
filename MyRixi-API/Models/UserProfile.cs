namespace MyRixiApi.Models;

public class UserProfile
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string ProfileImage { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}