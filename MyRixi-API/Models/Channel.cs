namespace MyRixiApi.Models;

public enum ChatType
{
    PrivateMessage,    // MP entre utilisateurs hors communautés
    CommunityChannel   // Chat public dans une communauté
}

public class Channel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
    public ChatType Type { get; set; } = ChatType.CommunityChannel;
    
    // Pour les canaux de communauté
    public Guid? CommunityId { get; set; }
    public Community? Community { get; set; }
    
    // Pour les MP, nous garderons la collection de participants
    public ICollection<User> Participants { get; set; } = new List<User>();
    
    // Messages dans ce canal
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    
    // Membres autorisés (pour canaux privés dans une communauté)
    public ICollection<CommunityProfile> AllowedMembers { get; set; } = new List<CommunityProfile>();
}