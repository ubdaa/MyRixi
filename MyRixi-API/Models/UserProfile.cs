using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Models;

public class UserProfile : MainProfile
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    // Champs spécifiques à l'utilisateur global
    
    [StringLength(2048)]
    public string? PersonalWebsite { get; set; }
    [StringLength(2048)]
    public string? TwitterHandle { get; set; }
    [StringLength(2048)]
    public string? LinkedInProfile { get; set; }
}