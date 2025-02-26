using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : Controller
{
    public readonly IMapper _mapper;
    
    public ProfileController(IMapper mapper)
    {
        _mapper = mapper;
    }
    
    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> GetProfile()
    {
        return Ok();
    }
    
    [Authorize]
    [HttpGet("community")]
    public async Task<IActionResult> GetCommunityProfile()
    {
        return Ok();
    }
    
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetGlobalProfile(Guid userId)
    {
        return Ok();
    }
    
    [HttpGet("community/{communityId}")]
    public async Task<IActionResult> GetCommunityProfile(Guid communityId)
    {
        return Ok();
    }
}