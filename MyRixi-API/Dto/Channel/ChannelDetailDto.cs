namespace MyRixiApi.Dto.Channel;

public class ChannelDetailDto : ChannelDto
{
    public List<UserChannelDto> Participants { get; set; } = new List<UserChannelDto>();
    public List<MessageDto> Messages { get; set; } = new List<MessageDto>();
}
