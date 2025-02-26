namespace MyRixiApi.Dto.Channel;

public class ReactionDto
{
    public string Emoji { get; set; } = string.Empty;
    public int Count { get; set; }
    public List<Guid> Users { get; set; } = new List<Guid>();
}