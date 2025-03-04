using AutoMapper;
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
    private readonly IMapper _mapper;
    
    private readonly ICommunityRepository _communityRepository;
    private readonly IUserRepository _userRepository;
    
    private readonly IMediaService _mediaService;
    private readonly ILogger<CommunityController> _logger;
    private readonly UserManager<User> _userManager;

    public CommunityController(
        IMapper mapper,
        ICommunityRepository communityRepository,
        IUserRepository userRepository,
        IMediaService mediaService,
        ILogger<CommunityController> logger,
        UserManager<User> userManager)
    {
        _mapper = mapper;
        _communityRepository = communityRepository;
        _userRepository = userRepository;
        _mediaService = mediaService;
        _logger = logger;
        _userManager = userManager;
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCommunity(Guid id)
    {
        try
        {
            var community = await _communityRepository.GetByIdAsync(id);
            if (community == null) return NotFound();
            return Ok(_mapper.Map<CommunityResponseDto>(community));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching community {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    [Authorize]
    [HttpPost("{id}/join")]
    public async Task<IActionResult> JoinCommunity(Guid id)
    {
        try
        {
            var community = await _communityRepository.GetByIdAsync(id);
            if (community == null) return NotFound();
            
            // on récupère l'utilisateur connecté, on lui crée un profile de communauté et on l'ajoute à la liste des membres
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            user = await _userRepository.GetByIdAsync(user.Id);
            if (user == null) return NotFound();

            var profile = _mapper.Map<CommunityProfile>(user);
            profile.CommunityId = community.Id;
            //profile.Role = new CommunityRole { Id = Guid.NewGuid(), Name = "Member" };
            profile.JoinStatus = community.IsInviteOnly ? JoinStatus.Pending : JoinStatus.Accepted;

            await _communityRepository.AddMemberAsync(profile);

            return Ok();
        } 
        catch (Exception ex) 
        {
            _logger.LogError(ex, "Error occurred while joining community {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [Authorize]
    [HttpPost("{id}/leave")]
    public async Task<IActionResult> LeaveCommunity(Guid id)
    {
        try
        {
            var community = await _communityRepository.GetByIdAsync(id);
            if (community == null) return NotFound();
            
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            user = await _userRepository.GetByIdAsync(user.Id);
            if (user == null) return NotFound();

            var profile = await _communityRepository.GetMemberProfileAsync(community.Id, user.Id);
            if (profile == null) return NotFound();
            profile.JoinStatus = JoinStatus.Left;
            
            await _communityRepository.UpdateMemberStatusAsync(community.Id, user.Id, JoinStatus.Left);
            return Ok();
        } 
        catch (Exception ex) 
        {
            _logger.LogError(ex, "Error occurred while leaving community {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpGet("{id}/members/{userId}")]
    public async Task<IActionResult> GetMembers(Guid id, Guid userId)
    {
        try
        {
            var members = await _communityRepository.GetMembersAsync(userId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching members of community {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [HttpPost("search")]
    public async Task<IActionResult> SearchCommunity([FromBody] SearchCommunityDto model)
    {
        try
        {
            var communities = await _communityRepository.SearchAsync(model.SearchTerm);
            var response = communities.Select(c => _mapper.Map<CommunityResponseDto>(c)).ToList();
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching for communities");
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
                Id = Guid.NewGuid(),
                Name = model.Name,
                Description = model.Description,
                IsPrivate = model.IsPrivate,
                IsInviteOnly = model.IsInviteOnly,
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
            await _communityRepository.CreateAsync(community);
        
            // Créer le profil de propriétaire avec un GUID généré
            var profile = _mapper.Map<CommunityProfile>(user);
            profile.Id = Guid.NewGuid();
            profile.CommunityId = community.Id;
            profile.JoinStatus = JoinStatus.Accepted;
            //profile.Role = new CommunityRole { Id = Guid.NewGuid(), Name = "Owner", IsAdministrator = true, CommunityId = community.Id };
        
            // Lier le propriétaire à la communauté
            community.Members.Add(profile);
            
            await _communityRepository.CreateAsync(community);
        
            return Ok(_mapper.Map<CommunityResponseDto>(community));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating community");
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
}