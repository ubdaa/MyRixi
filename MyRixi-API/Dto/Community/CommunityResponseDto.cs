using MyRixiApi.Dto.Roles;
using MyRixiApi.Models;

namespace MyRixiApi.Dto.Community;

public class CommunityResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; }
    public string IconUrl { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public List<CommunityRuleDto> Rules { get; set; } = new List<CommunityRuleDto>();
    public List<CommunityRoleDto> Roles { get; set; } = new List<CommunityRoleDto>();
    
    // Nouvelle propriété pour le profil du membre (celui qui est connecté)
    public CommuntiyProfileResponseDto? Member { get; set; }
}