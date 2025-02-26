namespace MyRixiApi.Dto.Media;

public class MediaDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}