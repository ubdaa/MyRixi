using MyRixiApi.DTOs;

namespace MyRixiApi.Interfaces;

public interface IProfileService
{
    Task<ProfileDto?> GetProfileByIdAsync(Guid profileId, Guid? currentUserId = null);
    Task<List<ProfileDto>> GetProfilesByCommunityIdAsync(Guid communityId, int page, int size, string searchTerm = "");
    Task<int> GetProfilesCountByCommunityIdAsync(Guid communityId);
}