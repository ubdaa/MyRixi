using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Community;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class CommunityController : Controller
{
    private readonly ICommunityRepository _communityRepository;
    private readonly ILogger<CommunityController> _logger;

    public CommunityController(
        ICommunityRepository communityRepository,
        ILogger<CommunityController> logger)
    {
        _communityRepository = communityRepository;
        _logger = logger;
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Community>> GetCommunity(Guid id)
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
    public async Task<ActionResult<Community>> CreateCommunity(CreateCommunityDto createCommunity)
    {
        try
        {
            var community = new Community
            {
                Name = createCommunity.Name,
                Description = createCommunity.Description,
                IconId = createCommunity.IconId,
                CoverId = createCommunity.CoverId
            };
            var createdCommunity = await _communityRepository.CreateAsync(community);
            
            return CreatedAtAction(
                nameof(GetCommunity),
                new { id = createdCommunity.Id },
                createdCommunity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating community");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}