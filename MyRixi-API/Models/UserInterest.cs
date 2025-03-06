namespace MyRixiApi.Models;

public class UserInterest
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid CategoryId { get; set; }
    public Category Category { get; set; }
    public double Weight { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}