using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Dto.Community;

public class CreateCommunityDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public bool IsPrivate { get; set; }
    [Required]
    public bool IsInviteOnly { get; set; }
    
    [Required]
    public IFormFile Icon { get; set; } = null!;
    
    [Required]
    public IFormFile Cover { get; set; } = null!;
    public List<CreateCommunityRuleDto>? Rules { get; set; }
}