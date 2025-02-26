namespace MyRixiApi.Models;

public class MessageReaction
{
    public Guid Id { get; set; }
    public string Emoji { get; set; } = string.Empty;
    
    public Guid MessageId { get; set; }
    public Message Message { get; set; } = null!;
    
    // Ajoutons la collection des utilisateurs ayant réagi
    public ICollection<User> Users { get; set; } = new List<User>();
}