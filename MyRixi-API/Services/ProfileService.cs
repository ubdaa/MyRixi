using MyRixiApi.DTOs;
using MyRixiApi.Interfaces;
using MyRixiApi.Mapping;
using MyRixiApi.Models;

namespace MyRixiApi.Services;

public class ProfileService : IProfileService
{
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly IUserRepository _userRepository;
    
    public ProfileService(
        IUserProfileRepository userProfileRepository,
        ICommunityRepository communityRepository,
        IUserRepository userRepository)
    {
        _userProfileRepository = userProfileRepository;
        _communityRepository = communityRepository;
        _userRepository = userRepository;
    }

    public async Task<ProfileDto?> GetProfileByIdAsync(Guid profileId, Guid? currentUserId = null)
    {
        User? currentUser = null;
        if (currentUserId.HasValue)
        {
            currentUser = await _userRepository.GetByIdAsync(currentUserId.Value);
        }

        // First try to find as user profile
        var userProfile = await _userProfileRepository.GetByIdAsync(profileId);
        if (userProfile != null)
        {
            bool isOwner = currentUserId.HasValue && userProfile.UserId == currentUserId.Value;
            return ProfileMapper.ToDTO(userProfile, isOwner, currentUser);
        }
        
        // If not found as user profile, try as community profile
        var communityProfile = await _communityRepository.GetMemberProfileAsync(profileId);
        if (communityProfile != null)
        {
            bool isOwner = currentUserId.HasValue && communityProfile.UserId == currentUserId.Value;
            return ProfileMapper.ToDTO(communityProfile, isOwner, currentUser);
        }
        
        return null;
    }

    public async Task<List<ProfileDto>> GetProfilesByCommunityIdAsync(Guid communityId, int page, int size, string searchTerm)
    {
        var communityProfiles = await _communityRepository.GetMemberProfilesAsync(communityId, page, size, searchTerm);

        return communityProfiles.Select(profile => 
            ProfileMapper.ToDTO(profile)).ToList();
    }

    public Task<int> GetProfilesCountByCommunityIdAsync(Guid communityId)
    {
        return _communityRepository.GetProfilesCountByCommunityIdAsync(communityId);
    }
}