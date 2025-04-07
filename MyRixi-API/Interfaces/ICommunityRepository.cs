using MyRixiApi.Models;

namespace MyRixiApi.Interfaces;

public interface ICommunityRepository : IGenericRepository<Community>
{
    Task<Community?> GetCommunityAsync(Guid id);
    Task<IEnumerable<Community>> SearchAsync(string searchTerm);
    
    Task<IEnumerable<Community>> GetCommunitiesAsync(int page, int size);
    Task<IEnumerable<CommunityProfile>> GetMembersAsync(Guid communityId);
    Task<IEnumerable<Community>> GetJoinedCommunitiesAsync(Guid userId);
    Task<CommunityProfile?> GetMemberProfileAsync(Guid userId);
    Task<CommunityProfile?> GetMemberProfileAsync(Guid communityId, Guid userId);
    Task AddMemberAsync(CommunityProfile profile);
    Task UpdateMemberRoleAsync(Guid communityId, Guid userId, CommunityRole newRole);
    Task UpdateMemberStatusAsync(Guid communityId, Guid userId, JoinStatus status);
    Task RemoveMemberAsync(Guid communityId, Guid userId);
    Task IsMemberAsync(Guid communityId, Guid userId);
}
