using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Models;

namespace MyRixiApi.Services;

public class PermissionService
{
    public static async Task SeedPermissionsAsync(ApplicationDbContext context)
    {
        string[] permissions = Enum.GetNames(typeof(PermissionType));
        var existingPermissions = await context.Permissions.ToListAsync();
        
        foreach (string permission in permissions)
        {
            if (existingPermissions.Any(p => p.Key == permission))
                continue;
            
            await context.Permissions.AddAsync(new Permission
            {
                Key = permission,
                Type = Enum.TryParse(typeof(PermissionType), permission, out var type) ? (PermissionType)type : throw new Exception("Invalid permission type"),
            });
        }
        
        await context.SaveChangesAsync();
    }
}