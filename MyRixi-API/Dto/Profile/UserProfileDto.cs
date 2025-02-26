using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;

namespace MyRixiApi.Dto.Profile;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    
    public MediaDto ProfilePicture { get; set; } = null!;
    public MediaDto CoverPicture { get; set; } = null!;
    public UserChannelDto User { get; set; } = null!;
}