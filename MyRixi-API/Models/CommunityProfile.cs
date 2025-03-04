using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Models;

public enum JoinStatus
{
    Pending,
    Accepted,
    Rejected,
    Left
}

public class CommunityProfile : MainProfile
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;
    
    [StringLength(255)]
    public string Pseudonym { get; set; } = string.Empty;
    
    public ICollection<CommunityProfileRole> ProfileRoles { get; set; } = new List<CommunityProfileRole>();
    
    public JoinStatus JoinStatus { get; set; } = JoinStatus.Pending;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsSuspended { get; set; } = false;
    public DateTime? SuspendedUntil { get; set; }
}

public class CommunityProfileRole
{
    public Guid CommunityProfileId { get; set; }
    public CommunityProfile CommunityProfile { get; set; } = null!;
    
    public Guid CommunityRoleId { get; set; }
    public CommunityRole CommunityRole { get; set; } = null!;
    
    public int Priority { get; set; } // Pour gérer l'ordre des rôles
}