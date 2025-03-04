namespace MyRixiApi.Models;

public class CommunityRole
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public bool IsProtected { get; set; } = false;
    public bool IsDefault { get; set; } = false;
    
    // Relation avec la communauté
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    
    // Relation avec les permissions
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    
    // Collection des profils ayant ce rôle
    public ICollection<CommunityProfile> AssignedProfiles { get; set; } = new List<CommunityProfile>();
    
    // Collection des profils ayant ce rôle
    public ICollection<CommunityProfileRole> ProfileRoles { get; set; } = new List<CommunityProfileRole>();
}

public class RolePermission
{
    public Guid RoleId { get; set; }
    public CommunityRole Role { get; set; } = null!;
    
    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}