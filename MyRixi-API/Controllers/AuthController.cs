using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyRixiApi.Dto.Auth;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
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
    private readonly IUserProfileRepository _userProfileRepository;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        IStorageService storageService,
        IUserProfileRepository userProfileRepository)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _storageService = storageService;
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

            var coverUrl = "https://minio-ysskscsocw084wok808w04wo.109.199.107.134.sslip.io/public/cover/default.webp";
            user.UserProfile.CoverPicture.Url = coverUrl;
            user.UserProfile.CoverPicture.Type = "image";

            // Mettre à jour l'utilisateur avec son profil
            await _userManager.UpdateAsync(user);
            
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { Token = GenerateJwtToken(user) });
        }

        return BadRequest(result.Errors);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized();

        if (user.UserName == null) return Unauthorized();
        
        var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, 
            isPersistent: false, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            return Ok(new { Token = GenerateJwtToken(user!) });
        }

        return Unauthorized();
    }
    
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest("Utilisateur invalide");
    
        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            return Ok(new { Message = "Email confirmé avec succès" });
        }
    
        return BadRequest(result.Errors);
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