using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyRixiApi.Dto.Auth;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
using MyRixiApi.Services;
using MyRixiApi.Utilities;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    
    private readonly IStorageService _storageService;
    private readonly IEmailSender _emailSender;
    private readonly IUserProfileRepository _userProfileRepository;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        IStorageService storageService,
        IEmailSender emailSender,
        IUserProfileRepository userProfileRepository)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _storageService = storageService;
        _emailSender = emailSender;
        _userProfileRepository = userProfileRepository;
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = Guid.NewGuid();

        var user = new User
        {
            Id = userId,
            UserName = model.Username,
            EmailConfirmed = false,
            Email = model.Email,
            UserProfile =  new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                DisplayName = model.Username,
                Bio = "Salut, je suis nouveau sur MyRixi !",
                ProfilePicture = new Media(),
                CoverPicture = new Media()
            }
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            // Générer et uploader les images (profile picture, cover picture, etc.)
            var profileUrl = await ProfilePictureGenerator.GenerateRandomProfilePictureAsync(_storageService, user.Id);
            user.UserProfile.ProfilePicture.Url = profileUrl;
            user.UserProfile.ProfilePicture.Type = "image";

            var coverUrl = "https://cdn.myrixi.com/public/cover/default.webp";
            user.UserProfile.CoverPicture.Url = coverUrl;
            user.UserProfile.CoverPicture.Type = "image";

            // Mettre à jour l'utilisateur avec son profil
            await _userManager.UpdateAsync(user);
            
            // Générer le token de confirmation d'email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        
            // Créer le lien de confirmation
            var confirmationLink = Url.Action(
                "ConfirmEmail", 
                "Auth", 
                new { userId = user.Id, token = token }, 
                Request.Scheme);
            
            if (string.IsNullOrEmpty(confirmationLink))
                return BadRequest("Erreur lors de la création du lien de confirmation.");
        
            // Préparer le contenu de l'email
            var subject = "Confirmation de votre compte MyRixi";
            var htmlMessage = EmailTemplates.GetEmailConfirmationTemplate(user.UserName, confirmationLink);
        
            // Envoyer l'email de confirmation
            await _emailSender.SendEmailAsync(user.Email, subject, htmlMessage);
        
            // Retourner un message de succès avec des informations sur la confirmation
            return Ok(new { 
                Message = "Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte.",
                RequiresEmailConfirmation = true
            });
        }

        return BadRequest(result.Errors);
    }
    
    [Authorize]
    [HttpGet("check-token")]
    public IActionResult CheckToken()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var user = _userManager.FindByIdAsync(userId).Result;
        if (user == null)
            return Unauthorized();

        return Ok(new { Message = "Token valide" });
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized(new { Message = "Email ou mot de passe incorrect." });

        // Vérifier si l'email est confirmé
        if (!user.EmailConfirmed)
        {
            return Ok(new { 
                Message = "Votre compte n'est pas encore activé. Veuillez vérifier votre email pour confirmer votre compte.",
                RequiresEmailConfirmation = true
            });
        }   

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (result.Succeeded)
        {
            return Ok(new { Token = GenerateJwtToken(user) });
        }

        return Unauthorized(new { Message = "Email ou mot de passe incorrect." });
    }
    
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
            return BadRequest("Les informations de confirmation sont invalides.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound("Utilisateur non trouvé.");

        // Confirmer l'email
        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            // Rediriger vers une page de confirmation ou retourner un succès
            return Redirect($"{_configuration["ClientAppUrl"]}/email-confirmation-success");
        }

        return BadRequest("Échec de la confirmation de l'email. Le lien pourrait être expiré ou invalide.");
    }
    
    
    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendConfirmationEmailDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Ok(new { Message = "Si votre email est enregistré, un nouvel email de confirmation vous a été envoyé." });

        if (user.EmailConfirmed)
            return BadRequest(new { Message = "Votre email est déjà confirmé." });

        // Générer un nouveau token de confirmation
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
    
        // Créer le lien de confirmation
        var confirmationLink = Url.Action(
            "ConfirmEmail", 
            "Auth", 
            new { userId = user.Id, token = token }, 
            Request.Scheme);
    
        // Préparer le contenu de l'email
        var subject = "Confirmation de votre compte MyRixi";
        var htmlMessage = EmailTemplates.GetEmailConfirmationTemplate(user.UserName!, confirmationLink!);
    
        // Envoyer l'email de confirmation
        await _emailSender.SendEmailAsync(user.Email, subject, htmlMessage);
    
        return Ok(new { Message = "Un nouvel email de confirmation a été envoyé." });
    }
    
    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}