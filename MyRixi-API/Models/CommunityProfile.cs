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
    
    public Guid RoleId { get; set; }
    public CommunityRole Role { get; set; } = null!;
    
    public JoinStatus JoinStatus { get; set; } = JoinStatus.Pending;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsSuspended { get; set; } = false;
    public DateTime? SuspendedUntil { get; set; }
}