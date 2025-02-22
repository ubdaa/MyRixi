namespace MyRixiApi.Models;

public class Conversation
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "private"; // private, group
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<User> Participants { get; set; } = new List<User>();
}