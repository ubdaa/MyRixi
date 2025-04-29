using System.ComponentModel.DataAnnotations;

namespace MyRixiApi.Dto.Auth;

public class ResendConfirmationEmailDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}