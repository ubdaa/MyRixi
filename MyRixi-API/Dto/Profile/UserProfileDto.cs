using MyRixiApi.Dto.Channel;
using MyRixiApi.Dto.Media;

namespace MyRixiApi.Dto.Profile;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    
    public Guid ProfilePictureId { get; set; }
    public MediaDto ProfilePicture { get; set; } = null!;
    
    public Guid CoverPictureId { get; set; }
    public MediaDto CoverPicture { get; set; } = null!;
    
    public Guid UserId { get; set; }  // Doit être de type Guid
    public UserChannelDto User { get; set; } = null!;
}