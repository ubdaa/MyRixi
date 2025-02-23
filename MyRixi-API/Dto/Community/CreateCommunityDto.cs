namespace MyRixiApi.Dto.Community;

public class CreateCommunityDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; }
    public IFormFile Icon { get; set; } = null!;
    public IFormFile Cover { get; set; } = null!;
    public List<CreateCommunityRuleDto>? Rules { get; set; }
}