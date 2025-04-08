namespace MyRixiApi.Dto.Profile;

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string? Bio { get; set; } = string.Empty;
    public IFormFile? ProfileFile { get; set; }
    public IFormFile? CoverFile { get; set; }
}