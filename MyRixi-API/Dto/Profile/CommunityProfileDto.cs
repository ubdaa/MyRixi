﻿using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;

namespace MyRixiApi.Dto.Profile;

public class CommunityProfileDto
{
    public Guid Id { get; set; }
    public Guid CommunityId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; }
    
    public MediaDto ProfilePicture { get; set; } = null!;
    public MediaDto CoverPicture { get; set; } = null!;
    public UserChannelDto User { get; set; } = null!;
}