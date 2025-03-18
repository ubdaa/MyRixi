using MyRixiApi.Dto.Tags;

namespace MyRixiApi.Dto.Posts;

public class PostResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<TagResponseDto> Tags { get; set; } = new();
}