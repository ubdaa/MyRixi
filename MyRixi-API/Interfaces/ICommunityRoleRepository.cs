using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface ICommunityRoleRepository : IGenericRepository<CommunityRole>
{
    Task<IEnumerable<CommunityRole>> GetRolesAsync(Guid communityId);
    Task<CommunityRole?> GetRoleAsync(Guid communityId, Guid roleId);
    Task AddRoleAsync(CommunityRole role);
    Task VerifyExistingPermissionsAsync();
    Task AddCommunityBaseRolesAsync(Guid communityId);
    Task<CommunityRole> GetOwnerRoleAsync(Guid communityId);
    Task<CommunityRole> GetMemberRoleAsync(Guid communityId);
}