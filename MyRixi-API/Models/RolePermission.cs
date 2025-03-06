namespace MyRixiApi.Models;

public class RolePermission
{
    public Guid RoleId { get; set; }
    public CommunityRole Role { get; set; } = null!;
    
    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}