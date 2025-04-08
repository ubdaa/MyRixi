using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Dto.Auth;


public class RegisterDto
{
    [Required]
    [MinLength(2, ErrorMessage = "Username must be at least 2 characters.")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Username can only contain letters, numbers, underscores and dashes.")]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$", 
        ErrorMessage = "Password must have at least one lowercase letter, one uppercase letter, one digit and one special character.")]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}