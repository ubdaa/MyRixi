using MyRixiApi.Dto.Media;
using MyRixiApi.Models;

namespace MyRixiApi.DTOs;

public class ProfileDto
{
    // Common properties from MainProfile
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public MediaDto ProfilePicture { get; set; } = null!;
    public MediaDto CoverPicture { get; set; } = null!;
    public string BackgroundColor { get; set; } = "#FFFFFF";
    public string AccentColor { get; set; } = "#000000";
    public bool IsPublic { get; set; } = true;
    public bool AllowDirectMessages { get; set; } = true;

    // User profile specific properties
    public string? PersonalWebsite { get; set; }
    public string? TwitterHandle { get; set; }
    public string? LinkedInProfile { get; set; }

    // Community profile specific properties
    public Guid? CommunityId { get; set; }
    public string? CommunityName { get; set; }
    public string? Pseudonym { get; set; }
    public string? JoinStatus { get; set; }
    public DateTime? JoinedAt { get; set; }
    public bool? IsSuspended { get; set; }
    public DateTime? SuspendedUntil { get; set; }
    public List<string>? Roles { get; set; }

    // Statistics
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int TotalLikes { get; set; }
    public int PostsCount { get; set; }
    public int CommentsCount { get; set; }

    // Profile type flag
    public string ProfileType { get; set; } = "user"; // "user" or "community"

    // User info
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public bool IsVerified { get; set; }

    // Relationship flags
    public bool IsOwner { get; set; }
    public bool IsFollowing { get; set; }
    public bool IsMember { get; set; }
}