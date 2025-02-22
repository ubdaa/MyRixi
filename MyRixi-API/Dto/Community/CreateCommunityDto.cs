namespace MyRixiApi.Dto.Community;

public class CreateCommunityDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public Guid IconId { get; set; }
    public Guid CoverId { get; set; }
}