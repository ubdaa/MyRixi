using MyRixiApi.Dto.Community;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class CommunityController : Controller
{
    private readonly ICommunityRepository _communityRepository;
    private readonly IUserRepository _userRepository;
    
    private readonly IMediaService _mediaService;
    private readonly ILogger<CommunityController> _logger;
    private readonly UserManager<User> _userManager;

    public CommunityController(
        ICommunityRepository communityRepository,
        IUserRepository userRepository,
        IMediaService mediaService,
        ILogger<CommunityController> logger,
        UserManager<User> userManager)
    {
        _communityRepository = communityRepository;
        _userRepository = userRepository;
        _mediaService = mediaService;
        _logger = logger;
        _userManager = userManager;
    }
    
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Hello World");
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCommunity(Guid id)
    {
        try
        {
            var community = await _communityRepository.GetByIdAsync(id);
            if (community == null)
            {
                return NotFound();
            }
            return Ok(community);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching community {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateCommunity([FromForm] CreateCommunityDto model)
    {
        try
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);
            
            // on récupère l'utilisateur connecté, on lui crée un profile de communauté et on l'ajoute à la liste des membres
            var user = await _userManager.GetUserAsync(User);
            
            if (user == null)
            {
                return Unauthorized();
            }
            
            user = await _userRepository.GetByIdAsync(user.Id);
            
            if (user == null)
            {
                return NotFound();
            }
            
            var icon = await _mediaService.UploadMediaAsync(model.Icon);
            var cover = await _mediaService.UploadMediaAsync(model.Cover);
            
            var community = new Community
            {
                Name = model.Name,
                Description = model.Description,
                IconId = icon.Id,
                Icon = icon,
                CoverId = cover.Id,
                Cover = cover,
                Rules = model.Rules?.Select((r, i) => new CommunityRule
                {
                    Id = Guid.NewGuid(),
                    Title = r.Title,
                    Description = r.Description,
                    Order = i
                }).ToList() ?? new List<CommunityRule>()
            };
            
            var profile = new CommunityProfile
            {
                UserId = user.Id,
                CommunityId = community.Id,
                Pseudonym = user.UserProfile.DisplayName,
                Role = "Owner",
                ProfilePictureId = user.UserProfile.ProfilePictureId,
                CoverPictureId = user.UserProfile.CoverPictureId,
            };
            
            community.Members.Add(profile);
            
            await _communityRepository.CreateAsync(community);
            
            return Ok(new CommunityResponseDto
            {
                Id = community.Id,
                Name = community.Name,
                Description = community.Description,
                IconUrl = community.Icon?.Url ?? "",
                CoverUrl = community.Cover?.Url ?? "",
                Rules = community.Rules.Select(r => new CommunityRuleDto
                {
                    Id = r.Id,
                    Title = r.Title,
                    Description = r.Description,
                    Order = r.Order
                }).ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating community");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}