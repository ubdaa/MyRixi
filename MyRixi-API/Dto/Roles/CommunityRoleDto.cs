using MyRixiApi.Models;

namespace MyRixiApi.Dto.Roles;

public class CommunityRoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public bool IsProtected { get; set; } = false;
    public bool IsDefault { get; set; } = false;
    
    public ICollection<RolePermissionLightDto> RolePermissions { get; set; } = new List<RolePermissionLightDto>();
}

public class RolePermissionLightDto
{
    public Guid PermissionId { get; set; }
    public string PermissionKey { get; set; } = string.Empty;
    public string PermissionType { get; set; } = string.Empty;
}