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
    public async Task<IActionResult> GetCommunityMembers(Guid communityId, [FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null)
    {
        if (page < 1 || size < 1) return BadRequest("Page and size must be greater than 0");
        if (string.IsNullOrWhiteSpace(search)) search = string.Empty;
        
        try
        {
            var members = await _profileService.GetProfilesByCommunityIdAsync(communityId, page, size, search);
            var totalCount = await _profileService.GetProfilesCountByCommunityIdAsync(communityId);
            return Ok(new
            {
                Items = members,
                TotalCount = totalCount,
                Page = page,
                Size = size,
                TotalPages = (int)Math.Ceiling((double)totalCount / size)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting community members");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    #region EDITION DU PROFIL
    
    [Authorize]
    [HttpPut("/{profileId}/edit")]
    public async Task<IActionResult> EditProfile(Guid profileId, [FromForm] UpdateProfileDto profileDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userId = GetCurrentUserId();
            var profile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                return NotFound();
            }

            if (profile.Id != profileId)
            {
                return Forbid();
            }

            // ajouter toute la logique pour l'édition du profil
            
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while updating profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    #endregion
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}