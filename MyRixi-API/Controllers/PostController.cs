﻿using System.Security.Claims;
using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto;
using MyRixiApi.Dto.Posts;
using MyRixiApi.Dto.Tags;
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
    private readonly IAttachmentRepository _attachmentRepository;
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
        IAttachmentRepository attachmentRepository,
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
        _attachmentRepository = attachmentRepository;
        _logger = logger;
        _userManager = userManager;
    }
    
    #region DRAFTS
    
    [Authorize]
    [HttpGet("community/{communityId}/drafts")]
    public async Task<IActionResult> GetCommunityDrafts(Guid communityId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var communityProfile = await _communityProfileRepository.GetByUserIdAsync(communityId, Guid.Parse(userId));
        if (communityProfile == null) return Unauthorized();
        
        var posts = await _postRepository.GetUserDrafts(communityId, communityProfile.UserId);
        return Ok(_mapper.Map<IEnumerable<PostResponseDto>>(posts));
    }

    [Authorize]
    [HttpPost("community/{communityId}/draft/create")]
    public async Task<IActionResult> CreateDraft(Guid communityId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var communityProfile = await _communityProfileRepository.GetByUserIdAsync(communityId, Guid.Parse(userId));
        if (communityProfile == null) return Unauthorized();
        
        var post = await _postRepository.CreateDraftAsync(communityId, communityProfile.Id);
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
    
    [Authorize]
    [HttpPost("draft/{id}/attachment")]
    public async Task<IActionResult> UploadAttachment(Guid id, [FromForm] FileDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();

        var media = await _mediaService.UploadMediaAsync(model.File);
        var attachment = await _attachmentRepository.CreatePostAttachmentAsync(post.Id, media.Id);
        post.Attachments.Add(attachment);
        await _postRepository.UpdateAsync(post);
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
    
    [Authorize]
    [HttpDelete("draft/{id}/attachment/{attachmentId}")]
    public async Task<IActionResult> DeleteAttachment(Guid id, Guid attachmentId)
    {
        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        var attachment = post.Attachments.FirstOrDefault(a => a.Id == attachmentId);
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        if (attachment == null) return NotFound();
        
        await _attachmentRepository.DeleteAsync(attachmentId);
        
        return Ok();
    }
    
    [Authorize]
    [HttpGet("draft/{id}")]
    public async Task<IActionResult> GetDraft(Guid id)
    {
        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
    
    [Authorize]
    [HttpPut("draft/{id}")]
    public async Task<IActionResult> UpdateDraft(Guid id, [FromForm] UpdatePostDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        
        post.Title = model.Title;
        post.Content = model.Content;
        
        if (!string.IsNullOrEmpty(model.Tags))
        {
            try
            {
                var tagList = JsonSerializer.Deserialize<List<CreateTagDto>>(model.Tags);
                if (tagList != null)
                {
                    var createdTags = await _tagRepository.GetOrCreateTagsAsync(tagList.Select(t => t.Name).ToList());
                    post.Tags = (ICollection<Tag>)createdTags;
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid tags format: " + ex.Message);
            }
        }
        
        await _postRepository.UpdateAsync(post);
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
    
    [Authorize]
    [HttpPost("draft/{id}")]
    public async Task<IActionResult> PublishDraft(Guid id, [FromForm] UpdatePostDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        
        post.Title = model.Title;
        post.Content = model.Content;
        post.State = PostState.Published;
        
        if (!string.IsNullOrEmpty(model.Tags))
        {
            try
            {
                var tagList = JsonSerializer.Deserialize<List<CreateTagDto>>(model.Tags);
                if (tagList != null)
                {
                    var createdTags = await _tagRepository.GetOrCreateTagsAsync(tagList.Select(t => t.Name).ToList());
                    post.Tags = (ICollection<Tag>)createdTags;
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid tags format: " + ex.Message);
            }
        }

        await _postRepository.UpdateAsync(post);
        
        return Ok(_mapper.Map<PostResponseDto>(post));
    }
    
    [Authorize]
    [HttpDelete("draft/{id}")]
    public async Task<IActionResult> DeleteDraft(Guid id)
    {
        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        
        await _postRepository.DeleteAsync(id);
        
        return Ok();
    }
    
    #endregion
    
    #region PUBLISHED
    
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentPosts([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var posts = await _postRepository.GetPostsAsync(PostState.Published, page, size);
        // on range du plus récent au plus vieux
        posts = posts.OrderByDescending(p => p.PublishedAt);
        var dtos = _mapper.Map<IEnumerable<PostResponseDto>>(posts);
    
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            foreach (var dto in dtos)
            {
                var post = posts.First(p => p.Id == dto.Id);
                dto.IsLiked = post.Likes.Any(l => l.UserId.ToString() == userId);
            }
        }
    
        return Ok(dtos);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(Guid id)
    {
        try {
            var post = await _postRepository.GetPostAsync(id);
            if (post == null) return NotFound();
        
            var dto = _mapper.Map<PostResponseDto>(post);
        
            // Vérifier si l'utilisateur courant a liké le post
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                dto.IsLiked = post.Likes.Any(l => l.UserId.ToString() == userId);
            }
        
            return Ok(dto);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Error occurred while fetching post {Id}", id);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var post = await _postRepository.GetPostAsync(id);
        if (post == null) return NotFound();
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();
        
        if (post.CommunityProfile.UserId.ToString() != userId) return Unauthorized();
        
        await _postRepository.DeleteAsync(id);
        
        return Ok();
    }
    
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var posts = await _postRepository.SearchAsync(q);
        return Ok(_mapper.Map<IEnumerable<PostResponseDto>>(posts));
    }
    
    [HttpGet("community/{communityId}")]
    public async Task<IActionResult> GetCommunityPosts(Guid communityId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var posts = await _postRepository.GetPostsAsync(PostState.Published, communityId, page, size);
        // on range du plus récent au plus vieux
        posts = posts.OrderByDescending(p => p.PublishedAt);
        var dtos = _mapper.Map<IEnumerable<PostResponseDto>>(posts);
    
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            foreach (var dto in dtos)
            {
                var post = posts.First(p => p.Id == dto.Id);
                dto.IsLiked = post.Likes.Any(l => l.UserId.ToString() == userId);
            }
        }
    
        return Ok(dtos);
    }

    
    [HttpGet("community/{communityId}/user/{userId}")]
    public async Task<IActionResult> GetUserCommunityPosts(Guid communityId, Guid userId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var posts = await _postRepository.GetPostsAsync(communityId, userId, page, size);
        return Ok(_mapper.Map<IEnumerable<PostResponseDto>>(posts));
    }
    
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserPosts(Guid userId)
    {
        var posts = await _postRepository.GetPostsByUserAsync(userId);
        return Ok(_mapper.Map<IEnumerable<PostResponseDto>>(posts));
    }
    
    #endregion
}