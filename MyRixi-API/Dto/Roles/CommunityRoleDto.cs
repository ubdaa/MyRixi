using MyRixiApi.Models;

namespace MyRixiApi.Dto.Roles;

public class CommunityRoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public bool IsProtected { get; set; } = false;
    public bool IsDefault { get; set; } = false;
    
    public ICollection<RolePermissionDto> RolePermissions { get; set; } = new List<RolePermissionDto>();
}

public class RolePermissionDto
{
    public Guid RoleId { get; set; }
    public CommunityRole Role { get; set; } = null!;
    
    public Guid PermissionId { get; set; }
    public PermissionDto Permission { get; set; } = null!;
}

public class PermissionDto
{
    public string Key { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}