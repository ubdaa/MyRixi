using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Community;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class FeedController : Controller
{
    private readonly IMapper _mapper;
    
    private readonly ICommunityRepository _communityRepository;
    private readonly IUserRepository _userRepository;
    
    private readonly ILogger<FeedController> _logger;
    private readonly UserManager<User> _userManager;

    public FeedController(
        IMapper mapper,
        ICommunityRepository communityRepository,
        IUserRepository userRepository,
        ILogger<FeedController> logger,
        UserManager<User> userManager)
    {
        _mapper = mapper;
        _communityRepository = communityRepository;
        _userRepository = userRepository;
        _logger = logger;
        _userManager = userManager;
    }
    
    // méthode pour récupérer les communités rejoint de l'utilisateur connecté
    [Authorize]
    [HttpGet("communities")]
    public async Task<IActionResult> GetJoinedCommunities()
    {
        try
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            user = await _userRepository.GetByIdAsync(user.Id);
            if (user == null) return NotFound();
        
            var communities = await _communityRepository.GetJoinedCommunitiesAsync(user.Id);
            // Pour chaque communauté, on passe le CurrentUserId dans le mapping
            var communityDtos = communities.Select(c => 
                    _mapper.Map<JoinedCommunityResponseDto>(c, opts => opts.Items["CurrentUserId"] = user.Id))
                .ToList();
            
            return Ok(communityDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching joined communities");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}