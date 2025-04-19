using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyRixiApi.Dto.Comment;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class CommentController : Controller
{
    private readonly ICommentRepository _commentRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICommunityProfileRepository _profileRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly ILogger<CommentController> _logger;

    public CommentController(
        ICommentRepository commentRepository,
        IPostRepository postRepository,
        ICommunityProfileRepository profileRepository,
        IUserProfileRepository userProfileRepository,
        ILogger<CommentController> logger)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
        _profileRepository = profileRepository;
        _userProfileRepository = userProfileRepository;
        _logger = logger;
    }

    // Get comments for a post
    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetPostComments(Guid postId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        if (page < 1 || size < 1) return BadRequest("Page and size must be greater than 0");

        try
        {
            var comments = await _commentRepository.GetCommentsByPostIdAsync(postId, page, size);
            var totalCount = await _commentRepository.GetCommentsCountByPostIdAsync(postId);
            
            return Ok(new
            {
                Items = comments,
                TotalCount = totalCount,
                Page = page,
                Size = size,
                TotalPages = (int)Math.Ceiling((double)totalCount / size)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while retrieving comments for post {PostId}", postId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Get comments for a profile
    [HttpGet("profile/{profileId}")]
    public async Task<IActionResult> GetProfileComments(Guid profileId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        if (page < 1 || size < 1) return BadRequest("Page and size must be greater than 0");

        try
        {
            var comments = await _commentRepository.GetCommentsByProfileIdAsync(profileId, page, size);
            var totalCount = await _commentRepository.GetCommentsCountByProfileIdAsync(profileId);
            
            return Ok(new
            {
                Items = comments,
                TotalCount = totalCount,
                Page = page,
                Size = size,
                TotalPages = (int)Math.Ceiling((double)totalCount / size)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while retrieving comments for profile {ProfileId}", profileId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Get replies to a comment
    [HttpGet("{commentId}/replies")]
    public async Task<IActionResult> GetCommentReplies(Guid commentId, [FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        if (page < 1 || size < 1) return BadRequest("Page and size must be greater than 0");

        try
        {
            var replies = await _commentRepository.GetRepliesByCommentIdAsync(commentId, page, size);
            var totalCount = await _commentRepository.GetRepliesCountByCommentIdAsync(commentId);
            
            return Ok(new
            {
                Items = replies,
                TotalCount = totalCount,
                Page = page,
                Size = size,
                TotalPages = (int)Math.Ceiling((double)totalCount / size)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while retrieving replies for comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Create a comment on a post
    [Authorize]
    [HttpPost("post/{postId}")]
    public async Task<IActionResult> CreatePostComment(Guid postId, [FromBody] CreateCommentDto commentDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var userProfile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (userProfile == null) return BadRequest("User profile not found");

            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null) return NotFound("Post not found");

            var comment = new Comment
            {
                Content = commentDto.Content,
                PostId = postId,
                ProfileId = userProfile.Id,
                PostedAt = DateTime.UtcNow
            };

            if (commentDto.ParentCommentId.HasValue)
            {
                var parentComment = await _commentRepository.GetByIdAsync(commentDto.ParentCommentId.Value);
                if (parentComment == null) return NotFound("Parent comment not found");
                comment.ParentCommentId = commentDto.ParentCommentId;
            }

            await _commentRepository.CreateAsync(comment);
            return CreatedAtAction(nameof(GetCommentById), new { commentId = comment.Id }, comment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating comment for post {PostId}", postId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Create a comment on a profile
    [Authorize]
    [HttpPost("profile/{profileId}")]
    public async Task<IActionResult> CreateProfileComment(Guid profileId, [FromBody] CreateCommentDto commentDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var userProfile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (userProfile == null) return BadRequest("User profile not found");

            var profile = await _profileRepository.GetByIdAsync(profileId);
            if (profile == null) return NotFound("Profile not found");

            var comment = new Comment
            {
                Content = commentDto.Content,
                ProfileId = profileId,
                PostedAt = DateTime.UtcNow,
                Profile = userProfile
            };

            if (commentDto.ParentCommentId.HasValue)
            {
                var parentComment = await _commentRepository.GetByIdAsync(commentDto.ParentCommentId.Value);
                if (parentComment == null) return NotFound("Parent comment not found");
                comment.ParentCommentId = commentDto.ParentCommentId;
            }

            await _commentRepository.CreateAsync(comment);
            return CreatedAtAction(nameof(GetCommentById), new { commentId = comment.Id }, comment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while creating comment for profile {ProfileId}", profileId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Get a comment by ID
    [HttpGet("{commentId}")]
    public async Task<IActionResult> GetCommentById(Guid commentId)
    {
        try
        {
            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null) return NotFound();
            return Ok(comment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while retrieving comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Update a comment
    [Authorize]
    [HttpPut("{commentId}")]
    public async Task<IActionResult> UpdateComment(Guid commentId, [FromBody] UpdateCommentDto commentDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var userId = GetCurrentUserId();
            var userProfile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (userProfile == null) return BadRequest("User profile not found");

            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null) return NotFound();

            if (comment.ProfileId != userProfile.Id) return Forbid();

            comment.Content = commentDto.Content;
            await _commentRepository.UpdateAsync(comment);
            return Ok(comment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while updating comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    // Delete a comment
    [Authorize]
    [HttpDelete("{commentId}")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userProfile = await _userProfileRepository.GetByUserIdAsync(userId);
            if (userProfile == null) return BadRequest("User profile not found");

            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null) return NotFound();

            if (comment.ProfileId != userProfile.Id) return Forbid();

            await _commentRepository.DeleteAsync(comment.Id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while deleting comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while processing your request");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdClaim?.Value ?? Guid.Empty.ToString());
    }
}