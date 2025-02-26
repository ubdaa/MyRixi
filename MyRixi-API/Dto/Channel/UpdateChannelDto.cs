namespace MyRixiApi.Dto.Channel;

public class UpdateChannelDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
}