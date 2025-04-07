using MyRixiApi.DTOs;

namespace MyRixiApi.Interfaces;

public interface IProfileService
{
    Task<ProfileDto?> GetProfileByIdAsync(Guid profileId, Guid? currentUserId = null);
}