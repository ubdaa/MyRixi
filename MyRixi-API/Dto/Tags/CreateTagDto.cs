using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Dto.Tags;

public class CreateTagDto
{
    [Required(ErrorMessage = "Description is required")]
    public string Name { get; set; } = string.Empty;
}