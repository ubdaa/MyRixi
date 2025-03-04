using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class CommunityRoleRepository : GenericRepository<CommunityRole>, ICommunityRoleRepository
{
    public CommunityRoleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CommunityRole>> GetRolesAsync(Guid communityId)
    {
        return await _context.CommunityRoles
            .Where(cr => cr.CommunityId == communityId)
            .ToListAsync();
    }

    public async Task<CommunityRole?> GetRoleAsync(Guid communityId, Guid roleId)
    {
        return await _context.CommunityRoles
            .FirstOrDefaultAsync(cr => cr.CommunityId == communityId && cr.Id == roleId);
    }

    public async Task AddRoleAsync(CommunityRole role)
    {
        await CreateAsync(role);
    }

    public async Task VerifyExistingPermissionsAsync()
    {
        List<Permission> permissions = new();
        
        /*
        // Vérifier si les permissions de base existent avec le type PermissionType
        foreach (PermissionType permissionType in Enum.GetValues<PermissionType>())
        {
            if (!await _context.Permissions.AnyAsync(p => p.PermissionKey == permissionType.ToString()))
            {
                permissions.Add(new Permission
                {
                    PermissionKey = permissionType.ToString()
                });
            }
        }*/
    }
    
    public async Task AddCommunityBaseRolesAsync(Guid communityId)
    {
        // Créer les permissions de base
        /*var basePermissions = new List<Permission>
        {
            new Permission { 
                Name = "Membre de base", 
                PermissionKey = "BASE_MEMBER" 
            },
            new Permission { 
                Name = "Modérateur", 
                PermissionKey = "MODERATOR" 
            },
            new Permission { 
                Name = "Administrateur", 
                PermissionKey = "ADMINISTRATOR" 
            }
        };
        await _context.Permissions.AddRangeAsync(basePermissions);

        // Créer les rôles de base
        var baseRoles = new List<CommunityRole>
        {
            new CommunityRole 
            { 
                Name = "Membre", 
                CommunityId = communityId, 
                IsProtected = true,
                IsDefault = true,
                RolePermissions = basePermissions
                    .Where(p => p.PermissionKey == "BASE_MEMBER")
                    .Select(p => new RolePermission { Permission = p })
                    .ToList()
            },
            new CommunityRole 
            { 
                Name = "Modérateur", 
                CommunityId = communityId, 
                IsProtected = true,
                RolePermissions = basePermissions
                    .Where(p => p.PermissionKey == "BASE_MEMBER" || p.PermissionKey == "MODERATOR")
                    .Select(p => new RolePermission { Permission = p })
                    .ToList()
            },
            new CommunityRole 
            { 
                Name = "Administrateur", 
                CommunityId = communityId, 
                IsProtected = true,
                RolePermissions = basePermissions
                    .Select(p => new RolePermission { Permission = p })
                    .ToList()
            }
        };*/

        //await _context.CommunityRoles.AddRangeAsync(baseRoles);
        await _context.SaveChangesAsync();
    }

    public Task<CommunityRole> GetOwnerRoleAsync(Guid communityId)
    {
        throw new NotImplementedException();
    }

    public Task<CommunityRole> GetMemberRoleAsync(Guid communityId)
    {
        throw new NotImplementedException();
    }
}