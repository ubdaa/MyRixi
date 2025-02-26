namespace MyRixiApi.Models;

public class Message
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    
    // Remplacer la référence à Conversation par Channel
    public Guid ChannelId { get; set; }
    public Channel Channel { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
    
    // Ajoutons la possibilité de joindre des médias
    public ICollection<Media> Attachments { get; set; } = new List<Media>();
    
    // Réactions aux messages
    public ICollection<MessageReaction> Reactions { get; set; } = new List<MessageReaction>();
}