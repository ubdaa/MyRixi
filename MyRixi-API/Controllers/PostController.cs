using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Posts;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class PostController : Controller
{
    private readonly IMapper _mapper;
    
    private readonly IPostRepository _postRepository;
    private readonly ITagRepository _tagRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMediaService _mediaService;
    private readonly ICommunityProfileRepository _communityProfileRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly ILogger<PostController> _logger;
    private readonly UserManager<User> _userManager;

    public PostController(
        IMapper mapper,
        IPostRepository postRepository,
        ITagRepository tagRepository,
        IUserRepository userRepository,
        IMediaService mediaService,
        ICommunityProfileRepository communityProfileRepository,
        ICommunityRepository communityRepository,
        ILogger<PostController> logger,
        UserManager<User> userManager)
    {
        _mapper = mapper;
        _postRepository = postRepository;
        _tagRepository = tagRepository;
        _userRepository = userRepository;
        _mediaService = mediaService;
        _communityProfileRepository = communityProfileRepository;
        _communityRepository = communityRepository;
        _logger = logger;
        _userManager = userManager;
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(Guid id)
    {
        try
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(_mapper.Map<PostResponseDto>(post));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching post {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    [Authorize]
    [HttpPost("{communityId}")]
    public async Task<IActionResult> CreatePost(Guid communityId, [FromBody] CreatePostDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var community = await _communityRepository.GetByIdAsync(communityId);
        if (community == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var user = await _userRepository.GetByIdAsync(Guid.Parse(userId));
        if (user == null) return Unauthorized();
        
        var communityProfile = await _communityProfileRepository.GetByUserIdAsync(communityId, user.Id);
        if (communityProfile == null) return Unauthorized();

        var post = _mapper.Map<Post>(model);
        post.CommunityId = community.Id;
        post.CommunityProfileId = communityProfile.Id;
        
        if (model.Tags != null)
        {
            var tags = await _tagRepository.GetOrCreateTagsAsync(model.Tags.Select(t => t.Name).ToList());
            post.Tags = (ICollection<Tag>)tags;
        }
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
}