using MyRixiApi.Dto.Attachments;
using MyRixiApi.Dto.Comments;
using MyRixiApi.Dto.Tags;
using MyRixiApi.Models;

namespace MyRixiApi.Dto.Posts;

public class PostResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public PostType PostType { get; set; }
    public PostState State { get; set; }
    
    // Informations sur l'auteur
    public AuthorDto Author { get; set; }
    public Guid CommunityId { get; set; }
    public string CommunityName { get; set; } = string.Empty;
    
    public List<TagResponseDto> Tags { get; set; } = new();
    public List<AttachmentResponseDto> Attachments { get; set; } = new();
    public List<CommentResponseDto> Comments { get; set; } = new();
    
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public bool IsLiked { get; set; }
}

public class AuthorDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
}