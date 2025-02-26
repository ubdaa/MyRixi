namespace MyRixiApi.Dto.Channel;

public class UserChannelDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
}