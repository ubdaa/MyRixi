using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Community;
using MyRixiApi.Interfaces;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class DiscoverController : Controller
{
    private readonly IMapper _mapper;
    private readonly ILogger<DiscoverController> _logger;
    
    private readonly ICommunityRepository _communityRepository;
    
    public DiscoverController(
        IMapper mapper,
        ILogger<DiscoverController> logger,
        ICommunityRepository communityRepository)
    {
        _mapper = mapper;
        _logger = logger;
        _communityRepository = communityRepository;
    }
    
    [HttpGet("communities")]
    public async Task<IActionResult> GetCommunities([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        try
        {
            var communities = await _communityRepository.GetCommunitiesAsync(page, size);
            return Ok(_mapper.Map<IEnumerable<CommunityResponseDto>>(communities));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching communities");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}