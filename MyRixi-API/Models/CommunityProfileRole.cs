namespace MyRixiApi.Models;

public class CommunityProfileRole
{
    public Guid CommunityProfileId { get; set; }
    public CommunityProfile CommunityProfile { get; set; } = null!;
    
    public Guid CommunityRoleId { get; set; }
    public CommunityRole CommunityRole { get; set; } = null!;
    
    public int Priority { get; set; } // Pour gérer l'ordre des rôles
}