namespace MyRixiApi.Models;

public class Media
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty; // image, video, audio
    public string Url { get; set; } = string.Empty;
    public string Metadata { get; set; } = string.Empty;
}