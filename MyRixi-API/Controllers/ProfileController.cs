using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Profile;
using MyRixiApi.Interfaces;
using Exception = System.Exception;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class ProfileController : Controller
{
    private readonly IMapper _mapper;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly ICommunityProfileRepository _communityProfileRepository;
    private readonly IProfileService _profileService;
    private readonly ILogger _logger;


    public ProfileController(IMapper mapper,
        IUserProfileRepository userProfileRepository,
        ICommunityProfileRepository communityProfileRepository,
        IProfileService profileService,
        ILogger<ProfileController> logger)
    {
        _mapper = mapper;
        _userProfileRepository = userProfileRepository;
        _communityProfileRepository = communityProfileRepository;
        _profileService = profileService;
        _logger = logger;
    }
    
    [HttpGet("{profileId}")]
    public async Task<IActionResult> GetProfile(Guid profileId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var profile = await _profileService.GetProfileByIdAsync(profileId, userId);
            if (profile == null)
            {
                return NotFound();
            }
            return Ok(profile);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            var userId = GetCurrentUserId();
            var profile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                return NotFound();
            }

            var profileDto = await _profileService.GetProfileByIdAsync(profile.Id, userId);
            return Ok(profileDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting user profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    [Authorize]
    [HttpGet("community/{communityId}")]
    public async Task<IActionResult> GetCommunityProfile(Guid communityId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var profile = await _communityProfileRepository.GetByUserIdAsync(communityId, userId);
            if (profile == null)
            {
                return NotFound();
            }
            var profileDto = await _profileService.GetProfileByIdAsync(profile.Id, userId);
            return Ok(profileDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting community profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpGet("community/{communityId}/members")]
    public async Task<IActionResult> GetCommunityMembers(Guid communityId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        try
        {
            var members = await _profileService.GetProfilesByCommunityIdAsync(communityId, page, size);
            return Ok(members);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting community members");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}