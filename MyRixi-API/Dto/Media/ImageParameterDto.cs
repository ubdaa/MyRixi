namespace MyRixiApi.Dto.Media;

public class ImageParameterDto : IMediaParameterDto
{
    public uint Width { get; set; }
    public uint Height { get; set; }
    public uint SquareX { get; set; }
    public uint SquareY { get; set; }
}