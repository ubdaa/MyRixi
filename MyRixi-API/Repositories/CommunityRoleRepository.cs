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
    
    public async Task AddCommunityBaseRolesAsync(Guid communityId)
    {
        // Créer les permissions de base
        var permissions = _context.Permissions.ToList();
        
        // Créer le rôle Admin
        var ownerRole = new CommunityRole
        {
            Id = Guid.NewGuid(),
            Name = "Owner",
            Description = "Owner of the community",
            IsProtected = true,
            IsDefault = false,
            CommunityId = communityId,
            RolePermissions = new List<RolePermission>()
        };
        
        // Ajouter toutes les permissions au rôle administrateur
        foreach (var perm in permissions)
        {
            ownerRole.RolePermissions.Add(new RolePermission
            {
                RoleId = ownerRole.Id,
                PermissionId = perm.Id,
                Permission = perm
            });
        }
        
        // Créer le rôle Modérateur
        var modRole = new CommunityRole
        {
            Id = Guid.NewGuid(),
            Name = "Modérateur",
            Description = "Rôle avec des droits modérés de gestion.",
            IsProtected = false,
            IsDefault = false,
            CommunityId = communityId,
            RolePermissions = new List<RolePermission>()
        };
        
        var modPermissions = new List<Permission>
        {
            permissions.FirstOrDefault(p => p.Type == PermissionType.CanManageChannels)!,
            permissions.FirstOrDefault(p => p.Type == PermissionType.CanKickMembers)!,
            permissions.FirstOrDefault(p => p.Type == PermissionType.CanBanMembers)!,
            permissions.FirstOrDefault(p => p.Type == PermissionType.CanModerateChat)!,
            permissions.FirstOrDefault(p => p.Type == PermissionType.CanPinMessages)!
        }
        .Where(p => p != null!)
        .ToList();
        
        foreach (var perm in modPermissions)
        {
            modRole.RolePermissions.Add(new RolePermission
            {
                RoleId = modRole.Id,
                PermissionId = perm.Id,
                Permission = perm
            });
        }
        
        // Créer le rôle Membre
        var memberRole = new CommunityRole
        {
            Id = Guid.NewGuid(),
            Name = "Member",
            Description = "Default role for community members.",
            IsProtected = false,
            IsDefault = true,
            CommunityId = communityId,
            RolePermissions = new List<RolePermission>()
        };
        
        await _context.CommunityRoles.AddRangeAsync(ownerRole, modRole, memberRole);;
        await _context.SaveChangesAsync();
    }

    public async Task<CommunityRole> GetOwnerRoleAsync(Guid communityId)
    {
        return (await _context.CommunityRoles
            .FirstOrDefaultAsync(cr => cr.CommunityId == communityId && cr.Name == "Owner"))!;
    }

    public Task<CommunityRole> GetMemberRoleAsync(Guid communityId)
    {
        return _context.CommunityRoles
            .FirstOrDefaultAsync(cr => cr.CommunityId == communityId && cr.Name == "Member")!;
    }
}