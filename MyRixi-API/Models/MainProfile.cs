namespace MyRixiApi.Models;

public abstract class MainProfile
{
    public Guid Id { get; set; }
    
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid ProfilePictureId { get; set; }
    public Media ProfilePicture { get; set; } = null!;
    
    public Guid CoverPictureId { get; set; }
    public Media CoverPicture { get; set; } = null!;
    
    public string BackgroundColor { get; set; } = "#FFFFFF";
    public string AccentColor { get; set; } = "#000000";
    
    public bool IsPublic { get; set; } = true;
    public bool AllowDirectMessages { get; set; } = true;
    
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}