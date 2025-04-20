using Microsoft.EntityFrameworkCore;
using MyRixiApi.Data;
using MyRixiApi.Dto.Comment;
using MyRixiApi.Interfaces;
using MyRixiApi.Models;

namespace MyRixiApi.Repositories;

public class CommentRepository : GenericRepository<Comment>, ICommentRepository
{
    public CommentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<Comment?> GetCommentWithRepliesAsync(Guid commentId)
    {
        return _context.Comments
            .Include(c => c.Replies)
            .Include(c => c.Sender)
            .ThenInclude(s => s!.ProfilePicture)
            .Include(c => c.ParentComment)
            .FirstOrDefaultAsync(c => c.Id == commentId);
    }

    public Task<List<CommentDto>> GetCommentsByPostIdAsync(Guid postId, int page = 1, int pageSize = 10)
    {
        return _context.Comments
            .Include(s => s.Sender)
            .ThenInclude(s => s!.ProfilePicture)
            .Where(c => c.PostId == postId)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                PostedAt = c.PostedAt,
                ParentCommentId = c.ParentCommentId,
                PostId = c.PostId,
                ProfileId = c.ProfileId ?? Guid.Empty,
                ProfileDisplayName = c.Sender!.DisplayName,
                ProfilePictureUrl = c.Sender.ProfilePicture.Url,
                RepliesCount = c.Replies.Count(),
                IsOwner = false
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public Task<List<CommentDto>> GetCommentsByProfileIdAsync(Guid profileId, int page = 1, int pageSize = 10)
    {
        return _context.Comments
            .Include(s => s.Sender)
            .ThenInclude(s => s!.ProfilePicture)
            .Where(c => c.ProfileId == profileId)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                PostedAt = c.PostedAt,
                ParentCommentId = c.ParentCommentId,
                PostId = c.PostId,
                ProfileId = c.ProfileId ?? Guid.Empty,
                ProfileDisplayName = c.Sender!.DisplayName,
                ProfilePictureUrl = c.Sender.ProfilePicture.Url,
                RepliesCount = c.Replies.Count(),
                IsOwner = false
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public Task<List<CommentDto>> GetRepliesByCommentIdAsync(Guid commentId, int page = 1, int pageSize = 10)
    {
        return _context.Comments
            .Include(s => s.Sender)
            .ThenInclude(s => s!.ProfilePicture)
            .Where(c => c.ParentCommentId == commentId)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                PostedAt = c.PostedAt,
                ParentCommentId = c.ParentCommentId,
                PostId = c.PostId,
                ProfileId = c.ProfileId ?? Guid.Empty,
                ProfileDisplayName = c.Sender!.DisplayName,
                ProfilePictureUrl = c.Sender.ProfilePicture.Url,
                RepliesCount = c.Replies.Count(),
                IsOwner = false
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public Task<int> GetCommentsCountByPostIdAsync(Guid postId)
    {
        return _context.Comments
            .CountAsync(c => c.PostId == postId);
    }
    
    public Task<int> GetCommentsCountByProfileIdAsync(Guid profileId)
    {
        return _context.Comments
            .CountAsync(c => c.ProfileId == profileId);
    }

    public Task<int> GetRepliesCountByCommentIdAsync(Guid commentId)
    {
        return _context.Comments
            .CountAsync(c => c.ParentCommentId == commentId);
    }
}