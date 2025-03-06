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
    
    // méthode pour récupérer une liste de communautés
    [HttpGet("communities")]
    public async Task<IActionResult> GetCommunities([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var communities = await _communityRepository.GetCommunitiesAsync(page, size);
        return Ok(_mapper.Map<IEnumerable<CommunityResponseDto>>(communities));
    }
    
}