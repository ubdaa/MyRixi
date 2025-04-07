using MyRixiApi.Dto.Media;
using MyRixiApi.DTOs;
using MyRixiApi.Models;

namespace MyRixiApi.Mapping;

public static class ProfileMapper
{
    public static ProfileDto ToDTO(MainProfile profile, bool isOwner = false, User? currentUser = null)
    {
        var dto = new ProfileDto
        {
            Id = profile.Id,
            DisplayName = profile.DisplayName,
            Bio = profile.Bio,
            CreatedAt = profile.CreatedAt,
            ProfilePicture = MapMedia(profile.ProfilePicture),
            CoverPicture = MapMedia(profile.CoverPicture),
            BackgroundColor = profile.BackgroundColor,
            AccentColor = profile.AccentColor,
            IsPublic = profile.IsPublic,
            AllowDirectMessages = profile.AllowDirectMessages,
            IsOwner = isOwner,
            CommentsCount = profile.Comments?.Count ?? 0
        };

        if (profile is UserProfile userProfile)
        {
            dto.ProfileType = "user";
            dto.UserId = userProfile.UserId;
            dto.Username = userProfile.User?.UserName ?? string.Empty;
            dto.IsVerified = userProfile.User?.EmailConfirmed ?? false;
            dto.PersonalWebsite = userProfile.PersonalWebsite;
            dto.TwitterHandle = userProfile.TwitterHandle;
            dto.LinkedInProfile = userProfile.LinkedInProfile;
            
            // Calculate statistics for user
            dto.FollowersCount = GetFollowersCount(userProfile.UserId);
            dto.FollowingCount = GetFollowingCount(userProfile.UserId);
            dto.TotalLikes = GetTotalLikes(userProfile.UserId);
            dto.PostsCount = GetPostsCount(userProfile.UserId);
            
            // Determine relationship with current user
            dto.IsFollowing = IsFollowing(currentUser?.Id, userProfile.UserId);
        }
        else if (profile is CommunityProfile communityProfile)
        {
            dto.ProfileType = "community";
            dto.UserId = communityProfile.UserId;
            dto.Username = communityProfile.User?.UserName ?? string.Empty;
            dto.IsVerified = communityProfile.User?.EmailConfirmed ?? false;
            dto.CommunityId = communityProfile.CommunityId;
            dto.CommunityName = communityProfile.Community?.Name;
            dto.Pseudonym = communityProfile.Pseudonym;
            dto.JoinStatus = communityProfile.JoinStatus.ToString();
            dto.JoinedAt = communityProfile.JoinedAt;
            dto.IsSuspended = communityProfile.IsSuspended;
            dto.SuspendedUntil = communityProfile.SuspendedUntil;
            dto.Roles = communityProfile.ProfileRoles?
                .Select(r => r.CommunityRole.Name)
                .ToList();
            
            // Calculate statistics for community
            dto.FollowersCount = GetCommunityMembersCount(communityProfile.CommunityId);
            dto.TotalLikes = GetCommunityTotalLikes(communityProfile.CommunityId);
            dto.PostsCount = GetCommunityPostsCount(communityProfile.CommunityId);
            
            // Determine relationship with current user
            dto.IsMember = IsMemberOfCommunity(currentUser?.Id, communityProfile.CommunityId);
        }

        return dto;
    }

    private static MediaDto MapMedia(Media media)
    {
        return new MediaDto
        {
            Id = media.Id,
            Url = media.Url,
            Type = media.Type,
        };
    }

    // These methods would be implemented to calculate the actual statistics
    private static int GetFollowersCount(Guid userId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetFollowingCount(Guid userId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetTotalLikes(Guid userId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetPostsCount(Guid userId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetCommunityMembersCount(Guid communityId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetCommunityTotalLikes(Guid communityId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static int GetCommunityPostsCount(Guid communityId) 
    {
        // Implementation would interact with repository
        return 0; // Placeholder
    }

    private static bool IsFollowing(Guid? currentUserId, Guid profileUserId)
    {
        if (!currentUserId.HasValue) return false;
        // Implementation would check if currentUserId follows profileUserId
        return false; // Placeholder
    }

    private static bool IsMemberOfCommunity(Guid? currentUserId, Guid communityId)
    {
        if (!currentUserId.HasValue) return false;
        // Implementation would check if currentUserId is a member of the community
        return false; // Placeholder
    }
}