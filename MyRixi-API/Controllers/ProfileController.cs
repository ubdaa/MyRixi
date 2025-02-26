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
    private readonly ILogger _logger;


    public ProfileController(IMapper mapper,
        IUserProfileRepository userProfileRepository,
        ICommunityProfileRepository communityProfileRepository,
        ILogger<ProfileController> logger)
    {
        _mapper = mapper;
        _userProfileRepository = userProfileRepository;
        _communityProfileRepository = communityProfileRepository;
        _logger = logger;
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
            return Ok(_mapper.Map<UserProfileDto>(profile));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting user profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserProfile(Guid userId)
    {
        try
        {
            var profile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserProfileDto>(profile));
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
            return Ok(_mapper.Map<CommunityProfileDto>(profile));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting community profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpGet("community/{communityId}/user/{userId}")]
    public async Task<IActionResult> GetCommunityProfile(Guid communityId, Guid userId)
    {
        try
        {
            var profile = await _communityProfileRepository.GetByUserIdAsync(communityId, userId);
            if (profile == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<CommunityProfileDto>(profile));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting community profile");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}