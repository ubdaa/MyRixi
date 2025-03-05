using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Models;

namespace MyRixiApi.Services;

public class PermissionService
{
    public static async Task SeedPermissionsAsync(ApplicationDbContext context)
    {
        string[] permissions = Enum.GetNames(typeof(PermissionType));
        
        foreach (string permission in permissions)
        {
            if (!await context.Permissions.AnyAsync(p => p.Key == permission))
            {
                await context.Permissions.AddAsync(new Permission
                {
                    Key = permission,
                    Type = Enum.Parse<PermissionType>(permission)
                });
            }
        }
        
        await context.SaveChangesAsync();
    }
}