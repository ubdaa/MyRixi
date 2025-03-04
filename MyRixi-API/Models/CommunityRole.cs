namespace MyRixiApi.Models;

public class CommunityRole
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public bool CanManageChannels { get; set; } = false;
    public bool CanKickMembers { get; set; } = false;
    public bool CanBanMembers { get; set; } = false;
    public bool CanModerateChat { get; set; } = false;
    public bool CanEditCommunitySettings { get; set; } = false;
    public bool CanPinMessages { get; set; } = false;
    public bool CanCreateEvents { get; set; } = false;
    public bool CanManageRoles { get; set; } = false;
    public bool IsAdministrator { get; set; } = false;
    
    // Relation avec la communauté
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    
    // Collection des profils ayant ce rôle
    public ICollection<CommunityProfile> AssignedProfiles { get; set; } = new List<CommunityProfile>();
}