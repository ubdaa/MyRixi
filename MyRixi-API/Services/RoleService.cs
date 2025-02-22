using Microsoft.AspNetCore.Identity;
using MyRixiApi.Models.Enums;

namespace MyRixiApi.Services;

public class RoleService
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = Enum.GetNames(typeof(UserRole));
        
        foreach (string role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }
}