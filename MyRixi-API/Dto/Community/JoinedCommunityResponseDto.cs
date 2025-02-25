namespace MyRixiApi.Dto.Community;

public class JoinedCommunityResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; }
    public string IconUrl { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public List<CommunityRuleDto> Rules { get; set; } = new List<CommunityRuleDto>();
    
    // Nouvelle propriété pour le profil du membre (celui qui est connecté)
    public CommuntiyProfileResponseDto? Profile { get; set; }
}